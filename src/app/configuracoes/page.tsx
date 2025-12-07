"use client";

import { useState, useEffect } from 'react';
import { Building2, DollarSign, Plus, Edit, Trash2, Save, X, ArrowLeft, Phone, Mail, MapPin, FileText, Calendar, CheckCircle2, XCircle, Shield, Key, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Empresa, ConfiguracaoValor } from '@/lib/types';
import { empresasMock, configuracoesValoresMock } from '@/lib/empresas-data';
import { authService } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ConfiguracoesPage() {
  const router = useRouter();
  const [empresas, setEmpresas] = useState<Empresa[]>(empresasMock);
  const [configuracoes, setConfiguracoes] = useState<ConfiguracaoValor[]>(configuracoesValoresMock);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [empresaSelecionada, setEmpresaSelecionada] = useState<Empresa | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Verificar se é admin
  useEffect(() => {
    if (!authService.isAdmin()) {
      router.push('/dashboard');
    }
  }, [router]);

  // Estado do formulário
  const [formData, setFormData] = useState<Partial<Empresa>>({
    nome: '',
    cnpj: '',
    telefone: '',
    email: '',
    endereco: '',
    valorPadraoEntrega: 0,
    ativa: true,
    observacoes: '',
    usuario: '',
    senha: '',
    nivelAcesso: 'empresa',
    permissoes: {
      criarPedidos: true,
      visualizarPedidos: true,
      cancelarPedidos: true,
      visualizarRelatorios: true,
      editarPerfil: true
    }
  });

  // Estado das configurações de valores
  const [valoresConfig, setValoresConfig] = useState({
    padrao: 0,
    expressa: 0,
    agendada: 0,
    noturna: 0
  });

  const iniciarNovaEmpresa = () => {
    setFormData({
      nome: '',
      cnpj: '',
      telefone: '',
      email: '',
      endereco: '',
      valorPadraoEntrega: 0,
      ativa: true,
      observacoes: '',
      usuario: '',
      senha: '',
      nivelAcesso: 'empresa',
      permissoes: {
        criarPedidos: true,
        visualizarPedidos: true,
        cancelarPedidos: true,
        visualizarRelatorios: true,
        editarPerfil: true
      }
    });
    setValoresConfig({
      padrao: 0,
      expressa: 0,
      agendada: 0,
      noturna: 0
    });
    setEmpresaSelecionada(null);
    setModoEdicao(true);
    setMostrarFormulario(true);
  };

  const editarEmpresa = (empresa: Empresa) => {
    setFormData(empresa);
    setEmpresaSelecionada(empresa);
    
    // Carregar configurações de valores existentes
    const configs = configuracoes.filter(c => c.empresaId === empresa.id);
    const novosValores = {
      padrao: configs.find(c => c.tipoEntrega === 'padrao')?.valor || empresa.valorPadraoEntrega,
      expressa: configs.find(c => c.tipoEntrega === 'expressa')?.valor || 0,
      agendada: configs.find(c => c.tipoEntrega === 'agendada')?.valor || 0,
      noturna: configs.find(c => c.tipoEntrega === 'noturna')?.valor || 0
    };
    setValoresConfig(novosValores);
    
    setModoEdicao(true);
    setMostrarFormulario(true);
  };

  const salvarEmpresa = () => {
    if (!formData.nome || !formData.valorPadraoEntrega || !formData.usuario || !formData.senha) {
      alert('Preencha os campos obrigatórios: Nome, Valor Padrão, Usuário e Senha');
      return;
    }

    // Verificar se usuário já existe (exceto se for edição da mesma empresa)
    const usuarioExiste = empresas.some(e => 
      e.usuario === formData.usuario && e.id !== empresaSelecionada?.id
    );
    
    if (usuarioExiste) {
      alert('Este nome de usuário já está em uso. Escolha outro.');
      return;
    }

    if (empresaSelecionada) {
      // Atualizar empresa existente
      setEmpresas(empresas.map(e => 
        e.id === empresaSelecionada.id 
          ? { ...e, ...formData } as Empresa
          : e
      ));

      // Atualizar configurações de valores
      atualizarConfiguracoesValores(empresaSelecionada.id);
    } else {
      // Criar nova empresa
      const novaEmpresa: Empresa = {
        id: Date.now().toString(),
        ...formData,
        dataCadastro: new Date(),
        ativa: true,
        nivelAcesso: 'empresa',
        permissoes: formData.permissoes!
      } as Empresa;

      setEmpresas([...empresas, novaEmpresa]);
      
      // Criar configurações de valores
      atualizarConfiguracoesValores(novaEmpresa.id);
    }

    cancelarEdicao();
  };

  const atualizarConfiguracoesValores = (empresaId: string) => {
    // Remover configurações antigas da empresa
    const configsFiltradas = configuracoes.filter(c => c.empresaId !== empresaId);
    
    // Adicionar novas configurações
    const novasConfigs: ConfiguracaoValor[] = [];
    
    if (valoresConfig.padrao > 0) {
      novasConfigs.push({
        id: `${empresaId}-padrao`,
        empresaId,
        tipoEntrega: 'padrao',
        valor: valoresConfig.padrao,
        descricao: 'Entrega padrão'
      });
    }
    
    if (valoresConfig.expressa > 0) {
      novasConfigs.push({
        id: `${empresaId}-expressa`,
        empresaId,
        tipoEntrega: 'expressa',
        valor: valoresConfig.expressa,
        descricao: 'Entrega expressa'
      });
    }
    
    if (valoresConfig.agendada > 0) {
      novasConfigs.push({
        id: `${empresaId}-agendada`,
        empresaId,
        tipoEntrega: 'agendada',
        valor: valoresConfig.agendada,
        descricao: 'Entrega agendada'
      });
    }
    
    if (valoresConfig.noturna > 0) {
      novasConfigs.push({
        id: `${empresaId}-noturna`,
        empresaId,
        tipoEntrega: 'noturna',
        valor: valoresConfig.noturna,
        descricao: 'Entrega noturna'
      });
    }

    setConfiguracoes([...configsFiltradas, ...novasConfigs]);
  };

  const excluirEmpresa = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta empresa?')) {
      setEmpresas(empresas.filter(e => e.id !== id));
      setConfiguracoes(configuracoes.filter(c => c.empresaId !== id));
    }
  };

  const toggleStatusEmpresa = (id: string) => {
    setEmpresas(empresas.map(e => 
      e.id === id ? { ...e, ativa: !e.ativa } : e
    ));
  };

  const cancelarEdicao = () => {
    setModoEdicao(false);
    setMostrarFormulario(false);
    setEmpresaSelecionada(null);
    setFormData({
      nome: '',
      cnpj: '',
      telefone: '',
      email: '',
      endereco: '',
      valorPadraoEntrega: 0,
      ativa: true,
      observacoes: '',
      usuario: '',
      senha: '',
      nivelAcesso: 'empresa',
      permissoes: {
        criarPedidos: true,
        visualizarPedidos: true,
        cancelarPedidos: true,
        visualizarRelatorios: true,
        editarPerfil: true
      }
    });
  };

  const getConfiguracoesEmpresa = (empresaId: string) => {
    return configuracoes.filter(c => c.empresaId === empresaId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 sm:p-3 rounded-xl shadow-lg">
                <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
                  Configurações
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Gerencie empresas e valores de entregas
                </p>
              </div>
            </div>

            {!mostrarFormulario && (
              <Button
                onClick={iniciarNovaEmpresa}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Empresa
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Estatísticas Rápidas */}
        {!mostrarFormulario && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Total de Empresas</p>
                    <p className="text-3xl font-bold mt-1">{empresas.length}</p>
                  </div>
                  <Building2 className="w-12 h-12 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Empresas Ativas</p>
                    <p className="text-3xl font-bold mt-1">
                      {empresas.filter(e => e.ativa).length}
                    </p>
                  </div>
                  <CheckCircle2 className="w-12 h-12 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Valor Médio</p>
                    <p className="text-3xl font-bold mt-1">
                      R$ {(empresas.reduce((acc, e) => acc + e.valorPadraoEntrega, 0) / empresas.length || 0).toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="w-12 h-12 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Formulário de Cadastro/Edição */}
        {mostrarFormulario && (
          <Card className="mb-6 border-2 border-purple-200 dark:border-purple-800">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {empresaSelecionada ? 'Editar Empresa' : 'Nova Empresa'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Informações Básicas */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">
                    Informações Básicas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome">Nome da Empresa *</Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        placeholder="Ex: Restaurante Sabor & Cia"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input
                        id="cnpj"
                        value={formData.cnpj}
                        onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                        placeholder="00.000.000/0000-00"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        value={formData.telefone}
                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                        placeholder="(00) 00000-0000"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="contato@empresa.com.br"
                        className="mt-1"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="endereco">Endereço</Label>
                      <Input
                        id="endereco"
                        value={formData.endereco}
                        onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                        placeholder="Rua, número - Bairro"
                        className="mt-1"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="observacoes">Observações</Label>
                      <Input
                        id="observacoes"
                        value={formData.observacoes}
                        onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                        placeholder="Informações adicionais"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Credenciais de Acesso */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Credenciais de Acesso
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="usuario">Usuário *</Label>
                      <div className="relative mt-1">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="usuario"
                          value={formData.usuario}
                          onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                          placeholder="usuario_empresa"
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Nome de usuário para login no sistema
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="senha">Senha *</Label>
                      <div className="relative mt-1">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="senha"
                          type={mostrarSenha ? 'text' : 'password'}
                          value={formData.senha}
                          onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                          placeholder="••••••••"
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setMostrarSenha(!mostrarSenha)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Senha para acesso ao sistema
                      </p>
                    </div>
                  </div>

                  {/* Permissões */}
                  <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-3">
                      Permissões da Empresa
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.permissoes?.criarPedidos}
                          onChange={(e) => setFormData({
                            ...formData,
                            permissoes: { ...formData.permissoes!, criarPedidos: e.target.checked }
                          })}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Criar Pedidos</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.permissoes?.visualizarPedidos}
                          onChange={(e) => setFormData({
                            ...formData,
                            permissoes: { ...formData.permissoes!, visualizarPedidos: e.target.checked }
                          })}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Visualizar Pedidos</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.permissoes?.cancelarPedidos}
                          onChange={(e) => setFormData({
                            ...formData,
                            permissoes: { ...formData.permissoes!, cancelarPedidos: e.target.checked }
                          })}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Cancelar Pedidos</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.permissoes?.visualizarRelatorios}
                          onChange={(e) => setFormData({
                            ...formData,
                            permissoes: { ...formData.permissoes!, visualizarRelatorios: e.target.checked }
                          })}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Visualizar Relatórios</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.permissoes?.editarPerfil}
                          onChange={(e) => setFormData({
                            ...formData,
                            permissoes: { ...formData.permissoes!, editarPerfil: e.target.checked }
                          })}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Editar Perfil</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Configuração de Valores */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Valores de Entrega
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="valorPadrao">Entrega Padrão *</Label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
                        <Input
                          id="valorPadrao"
                          type="number"
                          step="0.01"
                          min="0"
                          value={valoresConfig.padrao || formData.valorPadraoEntrega}
                          onChange={(e) => {
                            const valor = parseFloat(e.target.value) || 0;
                            setFormData({ ...formData, valorPadraoEntrega: valor });
                            setValoresConfig({ ...valoresConfig, padrao: valor });
                          }}
                          placeholder="0.00"
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Até 60 minutos</p>
                    </div>

                    <div>
                      <Label htmlFor="valorExpressa">Entrega Expressa</Label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
                        <Input
                          id="valorExpressa"
                          type="number"
                          step="0.01"
                          min="0"
                          value={valoresConfig.expressa}
                          onChange={(e) => setValoresConfig({ ...valoresConfig, expressa: parseFloat(e.target.value) || 0 })}
                          placeholder="0.00"
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Até 30 minutos</p>
                    </div>

                    <div>
                      <Label htmlFor="valorAgendada">Entrega Agendada</Label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
                        <Input
                          id="valorAgendada"
                          type="number"
                          step="0.01"
                          min="0"
                          value={valoresConfig.agendada}
                          onChange={(e) => setValoresConfig({ ...valoresConfig, agendada: parseFloat(e.target.value) || 0 })}
                          placeholder="0.00"
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Horário específico</p>
                    </div>

                    <div>
                      <Label htmlFor="valorNoturna">Entrega Noturna</Label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
                        <Input
                          id="valorNoturna"
                          type="number"
                          step="0.01"
                          min="0"
                          value={valoresConfig.noturna}
                          onChange={(e) => setValoresConfig({ ...valoresConfig, noturna: parseFloat(e.target.value) || 0 })}
                          placeholder="0.00"
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Após 20h</p>
                    </div>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={salvarEmpresa}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                  <Button
                    onClick={cancelarEdicao}
                    variant="outline"
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Empresas */}
        {!mostrarFormulario && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              Empresas Cadastradas ({empresas.length})
            </h2>

            {empresas.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Building2 className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Nenhuma empresa cadastrada ainda
                  </p>
                  <Button onClick={iniciarNovaEmpresa}>
                    <Plus className="w-4 h-4 mr-2" />
                    Cadastrar Primeira Empresa
                  </Button>
                </CardContent>
              </Card>
            ) : (
              empresas.map((empresa) => {
                const configs = getConfiguracoesEmpresa(empresa.id);
                
                return (
                  <Card key={empresa.id} className="hover:shadow-lg transition-all border-l-4 border-l-transparent hover:border-l-purple-500">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Informações da Empresa */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                {empresa.nome}
                                {empresa.ativa ? (
                                  <Badge className="bg-green-500">Ativa</Badge>
                                ) : (
                                  <Badge variant="secondary">Inativa</Badge>
                                )}
                              </h3>
                              {empresa.cnpj && (
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                  CNPJ: {empresa.cnpj}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  <Key className="w-3 h-3 mr-1" />
                                  Usuário: {empresa.usuario}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            {empresa.telefone && (
                              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                <Phone className="w-4 h-4 text-blue-500" />
                                <a href={`tel:${empresa.telefone}`} className="hover:text-blue-500 transition-colors">
                                  {empresa.telefone}
                                </a>
                              </div>
                            )}

                            {empresa.email && (
                              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                <Mail className="w-4 h-4 text-green-500" />
                                <a href={`mailto:${empresa.email}`} className="hover:text-green-500 transition-colors">
                                  {empresa.email}
                                </a>
                              </div>
                            )}

                            {empresa.endereco && (
                              <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400 sm:col-span-2">
                                <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                <span>{empresa.endereco}</span>
                              </div>
                            )}

                            {empresa.observacoes && (
                              <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400 sm:col-span-2">
                                <FileText className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                <span>{empresa.observacoes}</span>
                              </div>
                            )}

                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                              <Calendar className="w-4 h-4 text-orange-500" />
                              <span>Desde {empresa.dataCadastro.toLocaleDateString('pt-BR')}</span>
                            </div>
                          </div>

                          {/* Permissões */}
                          <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Permissões:</p>
                            <div className="flex flex-wrap gap-1">
                              {empresa.permissoes.criarPedidos && (
                                <Badge variant="outline" className="text-xs">Criar Pedidos</Badge>
                              )}
                              {empresa.permissoes.visualizarPedidos && (
                                <Badge variant="outline" className="text-xs">Ver Pedidos</Badge>
                              )}
                              {empresa.permissoes.cancelarPedidos && (
                                <Badge variant="outline" className="text-xs">Cancelar</Badge>
                              )}
                              {empresa.permissoes.visualizarRelatorios && (
                                <Badge variant="outline" className="text-xs">Relatórios</Badge>
                              )}
                              {empresa.permissoes.editarPerfil && (
                                <Badge variant="outline" className="text-xs">Editar Perfil</Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Valores de Entrega */}
                        <div className="lg:w-80 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                          <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Valores de Entrega
                          </h4>
                          <div className="space-y-2">
                            {configs.length > 0 ? (
                              configs.map((config) => (
                                <div key={config.id} className="flex justify-between items-center text-sm">
                                  <span className="text-slate-600 dark:text-slate-400 capitalize">
                                    {config.tipoEntrega.replace('_', ' ')}:
                                  </span>
                                  <span className="font-bold text-slate-800 dark:text-slate-100">
                                    R$ {config.valor.toFixed(2)}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <div className="text-sm text-slate-600 dark:text-slate-400">
                                <div className="flex justify-between items-center">
                                  <span>Padrão:</span>
                                  <span className="font-bold text-slate-800 dark:text-slate-100">
                                    R$ {empresa.valorPadraoEntrega.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => editarEmpresa(empresa)}
                          className="flex-1"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleStatusEmpresa(empresa.id)}
                          className="flex-1"
                        >
                          {empresa.ativa ? (
                            <>
                              <XCircle className="w-4 h-4 mr-2" />
                              Desativar
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Ativar
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => excluirEmpresa(empresa.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </main>
    </div>
  );
}
