import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";



export async function GET() {
    return Response.json({ success: true, data: 'THANK YOU!' }, { status: 200 });

}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, role, level, techstack, amount, userid } = body;

        console.log("Generating interview for user:", userid);

        const { text: questions } = await generateText({
            model: google("gemini-2.0-flash-001"),
            prompt: `Prepare questions for a job interview.
           The job role is ${role}.
           The job experience level is ${level}.
           The tech stack used in the job is: ${techstack}.
           The focus between behavioural and technical questions should lean towards: ${type}.
           The amount of questions required is: ${amount}.
           Please return only the questions, without any additional text.
           The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
           Return the questions formatted like this:
           ["Question 1", "Question 2", "Question 3"]
        
           Keep questions professional and relevant.
    `,
        });

        let parsedQuestions;
        try {
            parsedQuestions = JSON.parse(questions);
        } catch (e) {
            console.error("Failed to parse questions:", questions);
            // Fallback: try to find the array in the text
            const match = questions.match(/\[[\s\S]*\]/);
            if (match) {
                parsedQuestions = JSON.parse(match[0]);
            } else {
                throw new Error("Could not parse AI response as JSON array");
            }
        }

        const interview = {
            role,
            type,
            level,
            techstack: typeof techstack === 'string' ? techstack.split(',').map((s: string) => s.trim()) : techstack,
            questions: parsedQuestions,
            userId: userid,
            finalized: false, // Set to false initially, true when completed?
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection("interviews").add(interview);

        return Response.json({ success: true, interviewId: docRef.id }, { status: 200 });
    } catch (error: any) {
        console.error("Error in generate route:", error);
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}