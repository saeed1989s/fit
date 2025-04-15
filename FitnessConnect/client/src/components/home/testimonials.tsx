import { Card, CardContent } from "@/components/ui/card";
import { Rating } from "@/components/ui/rating";

export default function Testimonials() {
  // Sample testimonials for demonstration
  const testimonials = [
    {
      id: 1,
      name: "Alex M.",
      rating: 5,
      text: "Finding Michael on FitConnect was the best thing for my fitness journey. His custom strength program helped me gain 10lbs of muscle in just 3 months!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80"
    },
    {
      id: 2,
      name: "Jamie L.",
      rating: 5,
      text: "I've tried many fitness apps but FitConnect is different. Sarah's 12-week program helped me lose 25lbs, and I love that I can message her whenever I have questions.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80"
    },
    {
      id: 3,
      name: "Robert K.",
      rating: 4,
      text: "As a trainer myself, I joined FitConnect to expand my client base. The platform makes it easy to create and share workout plans, and my business has grown 40% in just 6 months!",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80"
    }
  ];

  return (
    <section className="mb-12 bg-white rounded-xl p-8 shadow-md">
      <h2 className="font-heading font-bold text-2xl mb-8 text-center">What Our Users Say</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map(testimonial => (
          <Card key={testimonial.id} className="bg-muted">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 mr-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                  <Rating value={testimonial.rating} />
                </div>
              </div>
              <p className="text-muted-foreground text-sm">"{testimonial.text}"</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
