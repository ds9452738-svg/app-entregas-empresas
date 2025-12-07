"use client";

import { useState, useEffect } from 'react';
import { Package, MapPin, DollarSign, TrendingUp, Clock, CheckCircle2, XCircle, Truck, User, Phone, Navigation, Power, Pause, Play, LogOut, Settings, Building2 } from 'lucide-react';
import { pedidosMock, entregadorMock } from '@/lib/mock-data';
import { Pedido, StatusEntrega, Entregador, StatusEntregador } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { authService } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosMock);
  const [entregador, setEntregador] = useState<Entregador>(entregadorMock);
  const [filtroStatus, setFiltroStatus] = useState<StatusEntrega | 'todos'>('todos');
  const [horaAtual, setHoraAtual] = useState(new Date());
  const [usuarioLogado, setUsuarioLogado] = useState(authService.getUsuarioLogado());

  // Verificar autenticação
  useEffect(() => {
    if (!authService.isLogado()) {
      router.push('/login');
    } else {
      setUsuarioLogado(authService.getUsuarioLogado());
    }
  }, [router]);

  // Atualizar hora a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setHoraAtual(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  // Cálculos financeiros do mês
  const totalMes = pedidos.reduce((acc, p) => acc + p.valor, 0);
  const totalEntregue = pedidos
    .filter(p => p.status === 'entregue')
    .reduce((acc, p) => acc + p.valor, 0);
  const totalPendente = totalMes - totalEntregue;
  const quantidadeEntregas = pedidos.length;

  // Filtrar pedidos
  const pedidosFiltrados = filtroStatus === 'todos' 
    ? pedidos 
    : pedidos.filter(p => p.status === filtroStatus);

  // Alternar status do entregador
  const toggleStatusEntregador = (novoStatus: StatusEntregador) => {
    setEntregador({
      ...entregador,
      status: novoStatus,
      ultimaAtualizacao: new Date()
    });
  };

  // Aceitar pedido
  const aceitarPedido = (pedidoId: string) => {
    setPedidos(pedidos.map(p => 
      p.id === pedidoId ? { ...p, status: 'em_rota' as StatusEntrega } : p
    ));
  };

  // Finalizar entrega
  const finalizarEntrega = (pedidoId: string) => {
    setPedidos(pedidos.map(p => 
      p.id === pedidoId ? { 
        ...p, 
        status: 'entregue' as StatusEntrega,
        dataEntrega: new Date()
      } : p
    ));
    
    // Atualizar estatísticas do entregador
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (pedido) {
      setEntregador({
        ...entregador,
        entregasHoje: entregador.entregasHoje + 1,
        valorArrecadado: entregador.valorArrecadado + pedido.valor
      });
    }
  };

  const getStatusBadge = (status: StatusEntrega) => {
    const configs = {
      pendente: { label: 'Pendente', variant: 'secondary' as const, icon: Clock, color: 'text-orange-600' },
      em_rota: { label: 'Em Rota', variant: 'default' as const, icon: Truck, color: 'text-blue-600' },
      entregue: { label: 'Entregue', variant: 'default' as const, icon: CheckCircle2, color: 'text-green-600' },
      cancelado: { label: 'Cancelado', variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' }
    };
    
    const config = configs[status];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getStatusEntregadorConfig = (status: StatusEntregador) => {
    const configs = {
      online: { 
        label: 'Online', 
        color: 'bg-green-500',
        textColor: 'text-green-600',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        icon: Power
      },
      offline: { 
        label: 'Offline', 
        color: 'bg-gray-500',
        textColor: 'text-gray-600',
        bgColor: 'bg-gray-50 dark:bg-gray-900/20',
        icon: Power
      },
      em_pausa: { 
        label: 'Em Pausa', 
        color: 'bg-orange-500',
        textColor: 'text-orange-600',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        icon: Pause
      }
    };
    return configs[status];
  };

  const statusConfig = getStatusEntregadorConfig(entregador.status);
  const StatusIcon = statusConfig.icon;

  if (!usuarioLogado) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header com Status do Entregador */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 sm:p-3 rounded-xl shadow-lg">
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
                  Dashboard - {usuarioLogado.nome}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  {horaAtual.toLocaleTimeString('pt-BR')} • {horaAtual.toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {authService.isAdmin() && (
                <Link href="/configuracoes">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Configurações
                  </Button>
                </Link>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>

          {/* Card de Status do Entregador */}
          <Card className={`mt-4 ${statusConfig.bgColor} border-2 ${statusConfig.color.replace('text-', 'border-')}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusConfig.color} rounded-full border-2 border-white dark:border-slate-800`}></div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">
                      {entregador.nome}
                    </h3>
                    <Badge variant="outline" className={`${statusConfig.textColor} border-current`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {entregador.entregasHoje} entregas • R$ {entregador.valorArrecadado.toFixed(2)}
                  </p>
                </div>

                {/* Botões de Status */}
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={entregador.status === 'online' ? 'default' : 'outline'}
                    onClick={() => toggleStatusEntregador('online')}
                    className="h-8 w-8 p-0"
                    title="Ficar Online"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={entregador.status === 'em_pausa' ? 'default' : 'outline'}
                    onClick={() => toggleStatusEntregador('em_pausa')}
                    className="h-8 w-8 p-0"
                    title="Pausar"
                  >
                    <Pause className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={entregador.status === 'offline' ? 'default' : 'outline'}
                    onClick={() => toggleStatusEntregador('offline')}
                    className="h-8 w-8 p-0"
                    title="Ficar Offline"
                  >
                    <Power className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Total do Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">
                R$ {totalMes.toFixed(2)}
              </div>
              <p className="text-xs text-blue-100 mt-1">
                {quantidadeEntregas} entregas
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Recebido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">
                R$ {totalEntregue.toFixed(2)}
              </div>
              <p className="text-xs text-green-100 mt-1">
                {pedidos.filter(p => p.status === 'entregue').length} entregues
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Pendente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">
                R$ {totalPendente.toFixed(2)}
              </div>
              <p className="text-xs text-orange-100 mt-1">
                {pedidos.filter(p => p.status !== 'entregue').length} em aberto
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Em Rota
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">
                {pedidos.filter(p => p.status === 'em_rota').length}
              </div>
              <p className="text-xs text-purple-100 mt-1">
                entregas ativas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={filtroStatus === 'todos' ? 'default' : 'outline'}
            onClick={() => setFiltroStatus('todos')}
            size="sm"
          >
            Todos ({pedidos.length})
          </Button>
          <Button
            variant={filtroStatus === 'pendente' ? 'default' : 'outline'}
            onClick={() => setFiltroStatus('pendente')}
            size="sm"
          >
            Pendentes ({pedidos.filter(p => p.status === 'pendente').length})
          </Button>
          <Button
            variant={filtroStatus === 'em_rota' ? 'default' : 'outline'}
            onClick={() => setFiltroStatus('em_rota')}
            size="sm"
          >
            Em Rota ({pedidos.filter(p => p.status === 'em_rota').length})
          </Button>
          <Button
            variant={filtroStatus === 'entregue' ? 'default' : 'outline'}
            onClick={() => setFiltroStatus('entregue')}
            size="sm"
          >
            Entregues ({pedidos.filter(p => p.status === 'entregue').length})
          </Button>
        </div>

        {/* Lista de Pedidos */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
            Pedidos ({pedidosFiltrados.length})
          </h2>
          
          {pedidosFiltrados.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                <p className="text-slate-600 dark:text-slate-400">
                  Nenhum pedido encontrado
                </p>
              </CardContent>
            </Card>
          ) : (
            pedidosFiltrados.map((pedido) => (
              <Card key={pedido.id} className="hover:shadow-lg transition-all border-l-4 border-l-transparent hover:border-l-blue-500">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col gap-4">
                    {/* Header do Card */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                          {pedido.empresa}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {pedido.cliente}
                        </p>
                      </div>
                      {getStatusBadge(pedido.status)}
                    </div>
                    
                    {/* Informações */}
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                        <span>{pedido.endereco}</span>
                      </div>
                      
                      {pedido.telefone && (
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Phone className="w-4 h-4 text-green-500" />
                          <a href={`tel:${pedido.telefone}`} className="hover:text-blue-500 transition-colors">
                            {pedido.telefone}
                          </a>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="text-slate-600 dark:text-slate-400">
                          Coleta: {pedido.dataColeta.toLocaleDateString('pt-BR')}
                        </span>
                        {pedido.dataEntrega && (
                          <span className="text-green-600 dark:text-green-400">
                            Entregue: {pedido.dataEntrega.toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Footer com Valor e Ações */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        R$ {pedido.valor.toFixed(2)}
                      </div>
                      
                      <div className="flex gap-2">
                        {pedido.status === 'pendente' && entregador.status === 'online' && (
                          <Button
                            size="sm"
                            onClick={() => aceitarPedido(pedido.id)}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                          >
                            <Truck className="w-4 h-4 mr-1" />
                            Aceitar
                          </Button>
                        )}
                        
                        {pedido.status === 'em_rota' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pedido.endereco)}`, '_blank')}
                            >
                              <Navigation className="w-4 h-4 mr-1" />
                              Navegar
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => finalizarEntrega(pedido.id)}
                              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Finalizar
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
