"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Play } from "lucide-react"
import type { SoundType } from "@/hooks/use-sound-effects"
import { useSound } from "@/contexts/sound-context"

interface SoundSettingsProps {
  className?: string
}

export function SoundSettings({ className }: SoundSettingsProps) {
  const { settings, updateSettings, playSound } = useSound()
  const [isOpen, setIsOpen] = useState(false)

  // Función para probar un sonido
  const testSound = (type: SoundType) => {
    playSound(type)
  }

  return (
    <div className={className}>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2">
        {settings.enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        <span>Sonido</span>
      </Button>

      {isOpen && (
        <Card className="mt-2 w-64 absolute right-0 z-10 shadow-lg animate-fadeIn">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Configuración de Sonido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Activar sonidos</span>
              <Switch checked={settings.enabled} onCheckedChange={(checked) => updateSettings({ enabled: checked })} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Volumen</span>
                <span className="text-xs text-muted-foreground">{Math.round(settings.volume * 100)}%</span>
              </div>
              <Slider
                value={[settings.volume * 100]}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) => updateSettings({ volume: value[0] / 100 })}
                disabled={!settings.enabled}
              />
            </div>

            <div className="space-y-2">
              <span className="text-sm">Probar sonidos:</span>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testSound("click")}
                  disabled={!settings.enabled}
                  className="text-xs"
                >
                  <Play className="h-3 w-3 mr-1" /> Clic
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testSound("add")}
                  disabled={!settings.enabled}
                  className="text-xs"
                >
                  <Play className="h-3 w-3 mr-1" /> Añadir
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testSound("remove")}
                  disabled={!settings.enabled}
                  className="text-xs"
                >
                  <Play className="h-3 w-3 mr-1" /> Quitar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
