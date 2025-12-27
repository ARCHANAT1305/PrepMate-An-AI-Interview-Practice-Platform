import { db } from "@/firebase/admin";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const FeedbackPage = async ({ params }: RouteParams) => {
    const { interviewId } = await params;

    // Fetch the feedback for this interview
    const snapshot = await db.collection("feedback")
        .where("interviewId", "==", interviewId)
        .limit(1)
        .get();

    if (snapshot.empty) {
        // Check if the interview exists but feedback is still generating
        const interviewDoc = await db.collection("interviews").doc(interviewId).get();
        if (!interviewDoc.exists) return notFound();

        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <h2>Analyzing your interview...</h2>
                <p>Please wait while we generate your feedback report.</p>
                <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                    Refresh Page
                </Button>
            </div>
        );
    }

    const feedback = snapshot.docs[0].data() as Feedback;

    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto py-10">
            <div className="flex flex-col gap-2">
                <Link href="/" className="text-light-500 hover:text-white flex items-center gap-2 mb-4">
                    ← Back to Dashboard
                </Link>
                <h1 className="text-4xl font-bold">Interview Feedback Report</h1>
                <div className="flex items-center gap-4 mt-2">
                    <div className="px-4 py-2 bg-primary/20 rounded-full border border-primary/30">
                        <span className="text-primary font-bold">Score: {feedback.totalScore}/100</span>
                    </div>
                    <span className="text-light-500">{new Date(feedback.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card-border p-6 flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">Strengths</h3>
                    <ul className="flex flex-col gap-2">
                        {feedback.strengths.map((s, i) => (
                            <li key={i} className="flex gap-2 items-start">
                                <span className="text-green-500">✓</span>
                                <span>{s}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="card-border p-6 flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">Areas for Improvement</h3>
                    <ul className="flex flex-col gap-2">
                        {feedback.areasForImprovement.map((a, i) => (
                            <li key={i} className="flex gap-2 items-start">
                                <span className="text-amber-500">⚠</span>
                                <span>{a}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="card-border p-6 flex flex-col gap-4">
                <h3 className="text-xl font-semibold">Final Assessment</h3>
                <p className="text-light-200 leading-relaxed italic">
                    "{feedback.finalAssessment}"
                </p>
            </div>

            <div className="card-border p-6 flex flex-col gap-6">
                <h3 className="text-xl font-semibold">Category Breakdown</h3>
                <div className="flex flex-col gap-6">
                    {feedback.categoryScores.map((c, i) => (
                        <div key={i} className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">{c.name}</span>
                                <span className="text-sm font-bold">{c.score}%</span>
                            </div>
                            <div className="w-full bg-light-800 rounded-full h-2.5">
                                <div
                                    className="bg-primary h-2.5 rounded-full"
                                    style={{ width: `${c.score}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-light-400 mt-1">{c.comment}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center mt-6">
                <Button asChild className="btn-primary px-8">
                    <Link href="/interview">Try Another Interview</Link>
                </Button>
            </div>
        </div>
    );
}

export default FeedbackPage;
