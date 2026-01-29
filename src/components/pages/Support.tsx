import { useState } from 'react';
import { Mail, MessageCircle, Phone, Search, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { toast } from 'sonner@2.0.3';

export default function Support() {
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const faqs = [
    {
      question: 'How do I search for flights?',
      answer: 'You can search for flights on our homepage by entering your departure city, destination, date, and number of passengers. Or, use our AI chat assistant for a conversational search experience.',
    },
    {
      question: 'How does fare prediction work?',
      answer: 'Our AI analyzes historical pricing data, seasonal trends, and booking patterns to predict whether flight prices will rise or fall, helping you decide the best time to book.',
    },
    {
      question: 'How do I set up price alerts?',
      answer: 'Go to the Alerts page from the main menu. Enter your route, preferred dates, and target price. We\'ll notify you via email and push notifications when prices drop.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and digital wallets through our secure Stripe integration.',
    },
    {
      question: 'Can I modify or cancel my booking?',
      answer: 'Yes, you can manage your bookings from your Dashboard. Modification and cancellation policies depend on the airline and fare type you selected.',
    },
    {
      question: 'Where can I find my e-ticket?',
      answer: 'Your e-ticket is available in your Dashboard under "My Trips". You can also download it as a PDF or save the QR code for easy airport check-in.',
    },
    {
      question: 'How do I track my flight status?',
      answer: 'Visit the Flight Status page and enter your flight number or route. You\'ll get real-time updates on departure, arrival, delays, and gate information.',
    },
    {
      question: 'Is my payment information secure?',
      answer: 'Absolutely. All payments are processed through Stripe with PCI-DSS compliance and SSL/TLS encryption. We never store your full card details.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to backend
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-foreground mb-4">How Can We Help?</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Find answers, get support, or chat with our AI assistant
          </p>

          {/* Search Bar */}
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Contact Options */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-foreground mb-2">AI Chat</h3>
                <p className="text-muted-foreground mb-4">Get instant answers from our AI assistant</p>
                <Button variant="outline" className="w-full" onClick={() => window.location.href = '/chat'}>
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-foreground mb-2">Email Support</h3>
                <p className="text-muted-foreground mb-4">We'll respond within 24 hours</p>
                <Button variant="outline" className="w-full" onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}>
                  Send Email
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-foreground mb-2">Phone Support</h3>
                <p className="text-muted-foreground mb-4">Mon-Fri, 9am-6pm EST</p>
                <Button variant="outline" className="w-full">
                  1800-3468-3409
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-foreground text-center mb-8">Frequently Asked Questions</h2>

            {filteredFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-6">
                    <AccordionTrigger className="text-foreground hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No results found for "{searchQuery}". Try a different search or contact us directly.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-foreground text-center mb-8">Send Us a Message</h2>
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      rows={6}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-foreground text-center mb-8">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-foreground mb-2">Getting Started Guide</h3>
                <p className="text-muted-foreground mb-4">
                  Learn how to use SkySmart's features to find and book the best flights
                </p>
                <Button variant="link" className="p-0">
                  Read Guide <ExternalLink className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-foreground mb-2">Travel Tips & Blog</h3>
                <p className="text-muted-foreground mb-4">
                  Expert advice on booking flights, travel hacks, and destination guides
                </p>
                <Button variant="link" className="p-0">
                  Visit Blog <ExternalLink className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}