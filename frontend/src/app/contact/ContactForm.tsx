'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const SUBJECTS = [
  'General Inquiry',
  'Order Question',
  'Custom Order',
  'Shipping & Delivery',
  'Returns & Exchanges',
  'Trade Program',
  'Other',
];

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subject, setSubject] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success('Message sent successfully! We will get back to you within 24 business hours.');
    setIsSubmitting(false);

    // Reset form
    const form = e.currentTarget;
    form.reset();
    setSubject('');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Full Name</Label>
          <Input
            id="contact-name"
            name="name"
            placeholder="Your full name"
            required
            className="bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email Address</Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="bg-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-subject">Subject</Label>
        <Select value={subject} onValueChange={(v) => setSubject(v ?? '')} required>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            {SUBJECTS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          name="message"
          placeholder="Tell us how we can help..."
          rows={5}
          required
          className="bg-white"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-pyra-forest text-white hover:bg-pyra-forest/90 sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="size-4" />
            Send Message
          </>
        )}
      </Button>
    </form>
  );
}
