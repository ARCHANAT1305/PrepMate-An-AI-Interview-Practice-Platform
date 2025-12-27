import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import InterviewCard from "@/components/InterviewCard";
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getInterviews } from '@/lib/actions/general.action';

const Page = async () => {
  const user = await getCurrentUser();
  const interviews = user ? await getInterviews(user.id) : [];

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>AI-guided interview practice with real-time feedback</h2>
          <p className="text-lg">
            Practice real interviews with AI and receive instant feedback to improve continuously.
          </p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Launch Interview Simulation</Link>

          </Button>
        </div>
        <Image src="/robot.jpeg" alt="robot-dude" width={400} height={400} className="max-sm:hidden" />


      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {interviews.length > 0 ? (
            interviews.map((interview: any) => (
              <InterviewCard {...interview} interviewId={interview.id} key={interview.id} />
            ))
          ) : (
            <p className="text-light-500">You haven't generated any interviews yet.</p>
          )}
        </div>

      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Top Recommended Interviews</h2>
        <div className="interviews-section">
          <p className="text-light-500">More interview templates coming soon!</p>
        </div>
      </section>
    </>
  )
}

export default Page