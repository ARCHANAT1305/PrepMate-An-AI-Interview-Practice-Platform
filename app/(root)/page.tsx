import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import InterviewCard from "@/components/InterviewCard";
import {dummyInterviews} from '@/constants';
const Page = () => {
  return (
    <>
    <section className ="card-cta">
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
          {dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id}/>

          ))}

      </div>

    </section>
    <section className="flex flex-col gap-6 mt-8">
      <h2>Take an Interview</h2>

      <div className="interviews-section">
        {dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id}/>

          ))}


            {/*<p>You have&apos;t taken any interviews yet.</p>*/}
      </div>
      

    </section>
    </>
    )
}

export default Page