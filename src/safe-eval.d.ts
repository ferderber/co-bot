declare module 'safe-eval' {
    export default function safeEval(str: string, o: object): string;
}