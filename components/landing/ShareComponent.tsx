'use client'

import { TooltipButton } from '@/components/ui/TooltipButton'
import { generateWhatsappMessage } from '@/lib/invitation'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

export function WhatsAppShareLinkPopover({ id }: { id: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    const link = await generateWhatsappMessage(id)
    if (!link) return
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full">
      <TooltipButton
        variant="outline"
        className="flex items-center w-full gap-2"
        onClick={() => copyToClipboard()}
        tooltipText="Copiar al portapapeles"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        <span>Compartir</span>
      </TooltipButton>
    </div>
  )

  /*   return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center w-full">
          <Share2 className="h-4 w-4 mr-2" />
          <span>Compartir</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex items-center justify-between">
          <h4 className="font-medium leading-none">
            Generar enlace para WhatsApp{' '}
          </h4>
        </div>
      </PopoverContent>
    </Popover>
  ) */
}
