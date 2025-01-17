import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";

import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4'>
      <Card className='w-full max-w-3xl'>
        <CardContent className='p-6 md:p-12 flex flex-col md:flex-row items-center gap-8'>
          <div className='flex-1 space-y-4 text-center md:text-left'>
            <h1 className='text-4xl md:text-6xl font-bold tracking-tight'>
              Welcome Back!
            </h1>
            <p className='text-muted-foreground text-lg'>
              Were glad to see you again. Ready to continue your journey?
            </p>
            <Button className='gap-2'>
              Get Started <ArrowRight className='h-4 w-4' />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
