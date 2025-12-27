import Agent from "@/components/Agent";
import { db } from "@/firebase/admin";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { notFound } from "next/navigation";

const Page = async ({ params }: RouteParams) => {
    const { interviewId } = await params;
    const user = await getCurrentUser();

    // Fetch the interview details from Firestore
    const doc = await db.collection("interviews").doc(interviewId).get();

    if (!doc.exists) {
        return notFound();
    }

    const interview = doc.data() as Interview;

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
            <div className="text-center">
                <h1 className="capitalize">{interview.role} Interview</h1>
                <p className="text-light-500 mt-2">Level: {interview.level} | Type: {interview.type}</p>
            </div>

            <Agent
                userName={user?.name || "Candidate"}
                userId={user?.id}
                interviewId={interviewId}
                type="interview"
                questions={interview.questions}
            />
        </div>
    );
}

export default Page;
