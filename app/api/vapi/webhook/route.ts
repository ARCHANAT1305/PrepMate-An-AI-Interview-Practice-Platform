import { db } from "@/firebase/admin";
import { createFeedback } from "@/lib/actions/general.action";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { message } = body;

        console.log("Received Vapi Webhook event:", message?.type);

        if (message?.type === "end-of-call-report") {
            const transcript = message.transcript;
            const interviewId = message.assistant?.variableValues?.interviewid || message.call?.variableValues?.interviewid;

            console.log("End of call report for interview:", interviewId);

            if (interviewId && transcript) {
                await createFeedback({
                    interviewId,
                    transcript,
                });
            }
        }

        return Response.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error("Error in Vapi Webhook:", error);
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
