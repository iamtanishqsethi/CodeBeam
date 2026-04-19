type MeetingSound =
    | "joined"
    | "left"
    | "message"
    | "sent"
    | "waiting"
    | "ended";

type ToneStep = {
    frequency: number;
    start: number;
    duration: number;
    type?: OscillatorType;
    gain?: number;
};

type WindowWithAudioContext = Window & {
    webkitAudioContext?: typeof AudioContext;
};

let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let lastPlayedAt = 0;

const SOUND_VOLUME = 0.12;
const MIN_PLAY_INTERVAL_MS = 80;

const soundPatterns: Record<MeetingSound, ToneStep[]> = {
    joined: [
        {frequency: 523.25, start: 0, duration: 0.08},
        {frequency: 659.25, start: 0.07, duration: 0.1},
        {frequency: 783.99, start: 0.16, duration: 0.12},
    ],
    left: [
        {frequency: 440, start: 0, duration: 0.1},
        {frequency: 329.63, start: 0.09, duration: 0.14},
    ],
    message: [
        {frequency: 880, start: 0, duration: 0.06, type: "sine"},
        {frequency: 1174.66, start: 0.055, duration: 0.08, type: "sine"},
    ],
    sent: [
        {frequency: 587.33, start: 0, duration: 0.055, type: "triangle", gain: 0.8},
    ],
    waiting: [
        {frequency: 698.46, start: 0, duration: 0.08, type: "triangle"},
        {frequency: 698.46, start: 0.13, duration: 0.08, type: "triangle"},
    ],
    ended: [
        {frequency: 392, start: 0, duration: 0.12, type: "sine"},
        {frequency: 293.66, start: 0.12, duration: 0.16, type: "sine"},
        {frequency: 220, start: 0.28, duration: 0.2, type: "sine"},
    ],
};

function getAudioContext() {
    if (typeof window === "undefined") return null;

    if (!audioContext) {
        const AudioContextConstructor = window.AudioContext || (window as WindowWithAudioContext).webkitAudioContext;
        if (!AudioContextConstructor) return null;

        audioContext = new AudioContextConstructor();
        masterGain = audioContext.createGain();
        masterGain.gain.value = SOUND_VOLUME;
        masterGain.connect(audioContext.destination);
    }

    return audioContext;
}

export async function warmMeetingSounds() {
    const context = getAudioContext();
    if (!context || context.state !== "suspended") return;

    try {
        await context.resume();
    } catch {
        // Browsers may require a direct user gesture before audio can start.
    }
}

export function playMeetingSound(sound: MeetingSound) {
    const nowMs = Date.now();
    if (nowMs - lastPlayedAt < MIN_PLAY_INTERVAL_MS) return;
    lastPlayedAt = nowMs;

    const context = getAudioContext();
    if (!context || !masterGain) return;

    if (context.state === "suspended") {
        void warmMeetingSounds();
    }

    const startTime = context.currentTime + 0.01;
    for (const step of soundPatterns[sound]) {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const toneStart = startTime + step.start;
        const toneEnd = toneStart + step.duration;
        const peakGain = step.gain ?? 1;

        oscillator.type = step.type ?? "triangle";
        oscillator.frequency.setValueAtTime(step.frequency, toneStart);

        gain.gain.setValueAtTime(0, toneStart);
        gain.gain.linearRampToValueAtTime(peakGain, toneStart + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.001, toneEnd);

        oscillator.connect(gain);
        gain.connect(masterGain);
        oscillator.start(toneStart);
        oscillator.stop(toneEnd + 0.02);
    }
}
