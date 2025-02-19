'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { TooltipButton } from '@/components/ui/TooltipButton'
import { generateWhatsappMessage } from '@/lib/invitation'
import { Check, Copy, Share2 } from 'lucide-react'
import { useState } from 'react'

export function WhatsAppShareLinkPopover({ id }: { id: string }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState({ client: false, manager: false })
  const [email, setEmail] = useState({ client: '', manager: '' })

  const copyToClipboard = async (type: 'client' | 'manager') => {
    const link = await generateWhatsappMessage(email[type], type, id)
    if (!link) return
    await navigator.clipboard.writeText(link)
    setCopied({ ...copied, [type]: true })
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center w-full">
          <Share2 className="h-4 w-4 mr-2" />
          <span>Compartir</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <h4 className="font-medium leading-none">
            Generar enlace para WhatsApp
          </h4>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label htmlFor="client-link">Inserte el email del Cliente</Label>
              <div className="flex">
                <Input
                  id="client-link"
                  defaultValue={email.client}
                  onChange={(e) =>
                    setEmail({ ...email, client: e.target.value })
                  }
                />
                <TooltipButton
                  variant="outline"
                  size="icon"
                  className="ml-2"
                  onClick={() => copyToClipboard('client')}
                  tooltipText="Copiar al portapapeles"
                >
                  {copied.client ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </TooltipButton>
              </div>
            </div>
            <div className="grid gap-1">
              <Label htmlFor="manager-link">Inserte el email del Manager</Label>
              <div className="flex">
                <Input
                  id="manager-link"
                  defaultValue={email.manager}
                  onChange={(e) =>
                    setEmail({ ...email, manager: e.target.value })
                  }
                />
                <TooltipButton
                  variant="outline"
                  size="icon"
                  className="ml-2"
                  onClick={() => copyToClipboard('manager')}
                  tooltipText="Copiar al portapapeles"
                >
                  {copied.manager ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </TooltipButton>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
