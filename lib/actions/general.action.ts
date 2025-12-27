'use server';

import { db } from "@/firebase/admin";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { feedbackSchema } from "@/constants";

export async function createFeedback(params: {
    interviewId: string;
    transcript: string;
}) {
    const { interviewId, transcript } = params;

    try {
        // 1. Fetch interview details to get the context (role, techstack, questions)
        const interviewDoc = await db.collection('interviews').doc(interviewId).get();
        if (!interviewDoc.exists) {
            throw new Error("Interview not found");
        }
        const interviewData = interviewDoc.data();

        // 2. Generate feedback using AI
        const { object: feedback } = await generateObject({
            model: google("gemini-2.0-flash-001"),
            schema: feedbackSchema,
            prompt: `
        You are an expert technical interviewer. Analyze the following interview transcript and provide detailed feedback.
        
        Interview Context:
        - Role: ${interviewData?.role}
        - Experience Level: ${interviewData?.level}
        - Tech Stack: ${interviewData?.techstack?.join(', ')}
        
        Transcript:
        ${transcript}
        
        Please evaluate the candidate's performance based on the transcript and provide:
        1. A total score out of 100.
        2. Category scores (e.g., Communication, Technical Knowledge, Problem Solving).
        3. Key strengths.
        4. Areas for improvement.
        5. A final summary assessment.
      `,
        });

        // 3. Save feedback to Firestore in a 'feedback' sub-collection or a separate collection
        // We'll save it to a 'feedback' collection with a reference to the interviewId
        await db.collection('feedback').add({
            ...feedback,
            interviewId,
            userId: interviewData?.userId,
            createdAt: new Date().toISOString(),
        });

        // 4. Update the interview to mark it as finalized
        await db.collection('interviews').doc(interviewId).update({
            finalized: true
        });

        return { success: true };
    } catch (error) {
        console.error("Error creating feedback:", error);
        return { success: false, error: "Failed to create feedback" };
    }
}

export async function getInterviews(userId: string) {
    try {
        const snapshot = await db.collection('interviews')
            .where('userId', '==', userId)
            // .orderBy('createdAt', 'desc') // Temporarily disabled to avoid index error. Please create the index via the link in terminal!
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching interviews:", error);
        return [];
    }
}
