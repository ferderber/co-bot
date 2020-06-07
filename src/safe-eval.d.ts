declare module 'safe-eval' {
    export default function safeEval(str: string, o: Record<string, unknown>): string;
}