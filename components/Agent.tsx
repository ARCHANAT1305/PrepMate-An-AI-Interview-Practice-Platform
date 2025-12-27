
'use client'

import React, { useEffect, useState } from 'react'
import { vapi } from "@/lib/vapi.sdk";
import Image from 'next/image'
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
//import { createFeedback } from "@/lib/actions/general.action";
import { generator, interviewer } from "@/constants";
enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}

interface SavedMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}


const Agent = ({ userName, userId, interviewId, type, questions }: AgentProps) => {
    const router = useRouter();
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [messages, setMessages] = useState<SavedMessage[]>([]);

    const [lastMessage, setLastMessage] = useState<string>("");

    useEffect(() => {
        const onCallStart = () => {
            setCallStatus(CallStatus.ACTIVE);
        };

        const onCallEnd = () => {
            setCallStatus(CallStatus.FINISHED);
        };

        const onMessage = (message: any) => {
            if (message.type === "transcript" && message.transcriptType === "final") {
                const newMessage = { role: message.role, content: message.transcript };
                setMessages((prev) => [...prev, newMessage]);
            }
        };

        const onSpeechStart = () => {
            setIsSpeaking(true);
        };

        const onSpeechEnd = () => {
            setIsSpeaking(false);
        };

        const onError = (error: Error) => {
            console.error("Vapi Error:", error);
            setCallStatus(CallStatus.INACTIVE);
        };

        vapi.on("call-start", onCallStart);
        vapi.on("call-end", onCallEnd);
        vapi.on("message", onMessage);
        vapi.on("speech-start", onSpeechStart);
        vapi.on("speech-end", onSpeechEnd);
        vapi.on("error", onError);

        return () => {
            vapi.off("call-start", onCallStart);
            vapi.off("call-end", onCallEnd);
            vapi.off("message", onMessage);
            vapi.off("speech-start", onSpeechStart);
            vapi.off("speech-end", onSpeechEnd);
            vapi.off("error", onError);
        };
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            setLastMessage(messages[messages.length - 1].content);
        }

        if (callStatus === CallStatus.FINISHED) {
            if (type === "generate") {
                router.push("/");
                router.refresh();
            } else if (interviewId) {
                // Redirect to feedback page or reload to show "Checking Feedback"
                router.push(`/interview/${interviewId}/feedback`);
            }
        }
    }, [messages, userId, callStatus, type, interviewId, router]);

    const handleCall = async () => {
        console.log("Preparing to start call...");
        console.log("Context Data:", { userName, userId, interviewId, type });
        console.log("Questions being passed:", questions);

        if (!userName || !userId) {
            console.warn("User name or ID is missing. The call might still start, but the AI won't know who you are.");
        }

        if (!process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN) {
            console.error("CRITICAL: Vapi Web Token (NEXT_PUBLIC_VAPI_WEB_TOKEN) is missing from environment variables!");
            return;
        }

        setCallStatus(CallStatus.CONNECTING);

        try {
            if (type === "generate") {
                console.log("Starting 'Generate' workflow...");
                await vapi.start(
                    undefined,
                    {
                        variableValues: {
                            username: userName || "Candidate",
                            userid: userId || "unknown",
                        },
                        clientMessages: ["transcript" as any],
                        serverMessages: ["end-of-call-report" as any],
                    },
                    undefined,
                    generator
                );
            } else {
                let formattedQuestions = "";
                if (questions && questions.length > 0) {
                    formattedQuestions = questions.map((q, i) => `${i + 1}. ${q}`).join("\n");
                } else {
                    console.warn("No questions found for this interview! The AI might not have anything to ask.");
                }

                console.log("Starting 'Interview' assistant...");
                await vapi.start(interviewer as any, {
                    variableValues: {
                        questions: formattedQuestions,
                        interviewid: interviewId,
                    },
                    clientMessages: ["transcript" as any],
                    serverMessages: ["end-of-call-report" as any],
                });
            }
            console.log("Vapi.start() executed successfully.");
        } catch (err: any) {
            console.error("Vapi call failed to initiate:", err);
            setCallStatus(CallStatus.INACTIVE);
        }
    }

    const handleDisconnect = async () => {
        setCallStatus(CallStatus.FINISHED);
        await vapi.stop();

    }

    const latestMessage = messages[messages.length - 1]?.content || "";
    const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;


    return (
        <>
            <div className="call-view">
                {/* AI Interviewer Card */}
                <div className="card-interviewer">
                    <div className="avatar">
                        <Image
                            src="/ai-avatar.png"
                            alt="profile-image"
                            width={65}
                            height={54}
                            className="object-cover"
                        />
                        {isSpeaking && <span className="animate-speak" />}
                    </div>
                    <h3>AI Interviewer</h3>
                </div>

                {/* User Profile Card */}
                <div className="card-border">
                    <div className="card-content">
                        <Image
                            src="/user-avatar.png"
                            alt="profile-image"
                            width={539}
                            height={539}
                            className="rounded-full object-cover size-[120px]"
                        />
                        <h3>{userName}</h3>

                    </div>


                </div>



            </div>

            {messages.length > 0 && (
                <div className="transcript-border">
                    <div className="transcript">
                        <p key={lastMessage} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}>
                            {lastMessage}

                        </p>

                    </div>

                </div>

            )}



            <div className="w-full flex justify-center">
                {callStatus != 'ACTIVE' ? (
                    <button className="btn-call" onClick={handleCall}>
                        <span className={cn('absolute animate-ping rounded-full opacity-75', callStatus != 'CONNECTING' && 'hidden')}
                        />
                        <span>
                            {isCallInactiveOrFinished ? 'call' : '. . .'}



                        </span>
                    </button>
                ) : (

                    <button className="btn-disconnect" onClick={handleDisconnect}>
                        End

                    </button>

                )}

            </div>
        </>
    )
}

export default Agent