"use client"

import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form"
import { z } from 'zod'
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import {Form} from "@/components/ui/form"
import { toast} from "sonner";
import { useRouter } from 'next/navigation';
import FormField from '@/components/FormField';
type AuthFormProps = {
  type?: string
}

const authFormSchema=(type:FormType)=>{
  return z.object({
    name:type==='sign-up'? z.string().min(3) :z.string().optional(),
    email:z.string().email(),
    password:z.string().min(3),
  })
}

const AuthForm = ({ type }: {type:FormType}) => {
  const router =useRouter();
  const formSchema=authFormSchema(type);
   const form = useForm<z.infer<typeof formSchema>>({
  resolver:zodResolver(formSchema),
  defaultValues:{
    name:"",
    email:"",
    password:"",
  },
})

function onSubmit(values:z.infer<typeof formSchema>){
try {
  if(type==='sign-up'){
    toast.success('Account created successfully!.Please sign in.');
    router.push('/sign-in');
  } else{
   toast.success('Sign in successfully.');
   router.push('/');
  }

}
catch (error) {
  console.log(error);
  toast.error('There was an error. Please try again.:${error}')
}

 
}
const isSignIn =type ==='sign-in';

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-4 card py-14 px-10">
        <div className="flex flex-row gap-3 justify-center">
          <Image src="/logo.jpeg" alt="logo" height={38} width={30} />
                <h2 className="text-2xl font-bold">PrepMate</h2>
                <h3>AI-Based Job Interview Practice Platform</h3>
        
        
       

      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
          {!isSignIn && (
            <FormField control={form.control}
             name="name" 
             label="Name" 
             placeholder='Your Name'/>
          )}

          <FormField control={form.control}
             name="email" 
             label="Email" 
             placeholder='Your Email Address'
             type="email"
             />

          <FormField control={form.control}
             name="password" 
             label="Password" 
             placeholder='Enter your password'
             type="password"
             />
          
         
          <Button className="btn"  type="submit">{isSignIn ? 'Sign in' :'Create an Account'}</Button>
        </form>
      </Form>
      <p className ="text-center">
        {isSignIn ? "Don't have an account? " : 'Already have an account? '}
        <Link href={!isSignIn ? '/sign-in' : '/sign-up'} className="text-primary underline hover:text-primary/80 transition-colors">
        {isSignIn ? "Sign in" : "Sign up"}
        </Link>
      </p>
       </div>
    </div>
  )
}

export default AuthForm