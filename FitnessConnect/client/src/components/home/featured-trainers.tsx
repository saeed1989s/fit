import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { TrainerCard } from "@/components/trainers/trainer-card";
import { User, TrainerProfile } from "@shared/schema";

type TrainerWithProfile = User & { trainerProfile?: TrainerProfile };

interface FeaturedTrainersProps {
  trainers: TrainerWithProfile[];
}

export default function FeaturedTrainers({ trainers }: FeaturedTrainersProps) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-2xl">Featured Trainers</h2>
        <Link href="/trainers">
          <a className="text-primary hover:text-primary-dark font-medium flex items-center">
            View All
            <ChevronRight className="h-5 w-5 ml-1" />
          </a>
        </Link>
      </div>
      
      {trainers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers.map((trainer) => (
            <TrainerCard key={trainer.id} trainer={trainer} />
          ))}
        </div>
      ) : (
        <div className="bg-muted rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No trainers available yet</h3>
          <p className="text-muted-foreground mb-4">
            Be the first to register as a trainer and start offering your expertise!
          </p>
          <Link href="/auth?tab=register&role=trainer">
            <a className="inline-flex items-center justify-center font-medium text-primary hover:underline">
              Register as a Trainer
              <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </Link>
        </div>
      )}
    </section>
  );
}
