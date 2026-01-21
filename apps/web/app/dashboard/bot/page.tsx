'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Bot, Save, Power, Clock, MessageSquare } from 'lucide-react';

interface BotConfig {
  welcomeMessage: string;
  businessHours: {
    enabled: boolean;
    start?: string;
    end?: string;
    days?: number[];
  };
  autoReply: boolean;
}

interface BotInstance {
  id: string;
  botToken: string | null;
  isActive: boolean;
  config: BotConfig | null;
}

export default function BotPage() {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  const { data: botInstance, isLoading } = useQuery<BotInstance>({
    queryKey: ['bot-instance'],
    queryFn: async () => {
      const response = await api.get('/bot-instances');
      return response.data;
    },
  });

  const [formData, setFormData] = useState({
    welcomeMessage: 'Olá! Bem-vindo ao nosso atendimento. Como posso ajudar?',
    autoReply: true,
    businessHours: {
      enabled: false,
      start: '08:00',
      end: '18:00',
    },
  });

  useEffect(() => {
    if (botInstance?.config) {
      setFormData({
        welcomeMessage: botInstance.config.welcomeMessage || formData.welcomeMessage,
        autoReply: botInstance.config.autoReply ?? true,
        businessHours: {
          enabled: botInstance.config.businessHours?.enabled ?? false,
          start: botInstance.config.businessHours?.start || '08:00',
          end: botInstance.config.businessHours?.end || '18:00',
        },
      });
    }
  }, [botInstance]);

  const updateConfigMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.patch(`/bot-instances/${botInstance?.id}/config`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bot-instance'] });
      setIsSaving(false);
    },
    onError: () => {
      setIsSaving(false);
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async (activate: boolean) => {
      const endpoint = activate ? 'activate' : 'deactivate';
      const response = await api.post(`/bot-instances/${botInstance?.id}/${endpoint}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bot-instance'] });
    },
  });

  const handleSave = () => {
    setIsSaving(true);
    updateConfigMutation.mutate(formData);
  };

  const handleToggleActive = () => {
    toggleActiveMutation.mutate(!botInstance?.isActive);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuração do Bot</h1>
          <p className="text-gray-500">Configure seu bot Telegram</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge 
            variant={botInstance?.isActive ? 'default' : 'secondary'}
            className={botInstance?.isActive ? 'bg-green-500' : ''}
          >
            {botInstance?.isActive ? '🟢 Online' : '⚫ Offline'}
          </Badge>
          <Button
            variant={botInstance?.isActive ? 'destructive' : 'default'}
            onClick={handleToggleActive}
            disabled={toggleActiveMutation.isPending}
          >
            <Power className="mr-2 h-4 w-4" />
            {botInstance?.isActive ? 'Desativar' : 'Ativar'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Mensagem de Boas-vindas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Mensagem de Boas-vindas
            </CardTitle>
            <CardDescription>
              Mensagem enviada quando um cliente inicia uma conversa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={formData.welcomeMessage}
              onChange={(e) => setFormData(prev => ({ ...prev, welcomeMessage: e.target.value }))}
              placeholder="Digite a mensagem de boas-vindas..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Resposta Automática */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Resposta Automática
            </CardTitle>
            <CardDescription>
              Ativar respostas automáticas do bot
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Resposta automática ativa</Label>
                <p className="text-sm text-gray-500">
                  O bot responderá automaticamente aos clientes
                </p>
              </div>
              <Switch
                checked={formData.autoReply}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, autoReply: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Horário de Funcionamento */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Horário de Funcionamento
            </CardTitle>
            <CardDescription>
              Defina em quais horários o bot estará disponível
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Limitar horário de atendimento</Label>
                <p className="text-sm text-gray-500">
                  O bot só responderá dentro do horário definido
                </p>
              </div>
              <Switch
                checked={formData.businessHours.enabled}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  businessHours: { ...prev.businessHours, enabled: checked }
                }))}
              />
            </div>

            {formData.businessHours.enabled && (
              <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Horário de Início</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={formData.businessHours.start}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      businessHours: { ...prev.businessHours, start: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">Horário de Término</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={formData.businessHours.end}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      businessHours: { ...prev.businessHours, end: e.target.value }
                    }))}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Botão Salvar */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </div>
  );
}
