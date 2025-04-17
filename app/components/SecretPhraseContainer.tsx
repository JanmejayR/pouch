"use client";

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { toast } from 'sonner'
import { Copy } from 'lucide-react'

interface Props {
  mnemonic: string;
  onChange?: (value: string) => void;
}

const SecretPhraseContainer = ({ mnemonic, onChange }: Props) => {

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast.success('Secret phrase copied!');
  }

  return (
    <main className="w-[40rem] mx-auto mt-10">
      <Card>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <div className="flex items-center justify-between pr-2">
                <AccordionTrigger className="text-2xl items-center hover:cursor-pointer">
                  Your Secret Phrase
                </AccordionTrigger>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => copyToClipboard(mnemonic)}
                  className="ml-2"
                >
                  <Copy className="h-5 w-5" />
                </Button>
              </div>

              <AccordionContent>
                {onChange ? (
                  <textarea
                    className="w-full border rounded-lg p-4 mt-4"
                    rows={3}
                    value={mnemonic}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Enter your 12 or 24 word secret phrase here..."
                  />
                ) : (
                  <div className="flex flex-wrap gap-x-4 gap-y-4 mt-4">
                    {mnemonic.split(' ').map((word, index) => (
                      <Button
                        key={index}
                        variant="secondary"
                        className="w-24 h-12 text-md rounded-lg"
                        onClick={() => copyToClipboard(mnemonic)}
                      >
                        {word}
                      </Button>
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </main>
  )
}

export default SecretPhraseContainer;
