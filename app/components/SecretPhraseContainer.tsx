"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { Copy } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  mnemonic: string;
  onChange?: (value: string) => void;
  onSave: () => void; 
}

const SecretPhraseContainer = ({ mnemonic, onChange, onSave }: Props) => {
  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Secret phrase copied!");
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
                  <div className="flex flex-col justify-start">
                    <Textarea
                      className="mx-8 w-[32rem] mt-4 !text-lg p-6 border border-input rounded-md focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary transition-all resize-none"
                      value={mnemonic}
                      onChange={(e) => onChange(e.target.value)}
                      placeholder="Enter your 12 or 24 word secret phrase here..."
                      rows={1}
                      style={{ overflow: "hidden", resize: "none" }}
                    />
                    <Button
                      variant="custom"
                      onClick={onSave}  
                      className="mt-4 w-40 text-md mx-8"
                    >
                      Save Secret Phrase
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-x-4 gap-y-4 mt-4">
                    {mnemonic.split(" ").map((word, index) => (
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
  );
};

export default SecretPhraseContainer;
