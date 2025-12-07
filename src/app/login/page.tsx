"use client";

import { useState, useEffect } from 'react';
import { LogIn, Eye, EyeOff, Building2, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { authService } from '@/lib/auth';
import { empresasMock, adminUser } from '@/lib/empresas-data';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Verificar se já está logado
  useEffect(() => {
    if (authService.isLogado()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const user = authService.login(usuario, senha, empresasMock, adminUser);
      
      if (user) {
        // Login bem-sucedido
        if (user.nivelAcesso === 'admin') {
          router.push('/dashboard');
        } else {
          router.push('/empresa/pedidos');
        }
      } else {
        setErro('Usuário ou senha incorretos');
      }
    } catch (error) {
      setErro('Erro ao fazer login. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-2xl mb-4">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Sistema de Entregas
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Faça login para acessar o sistema
          </p>
        </div>

        {/* Card de Login */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">Entrar</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Campo Usuário */}
              <div className="space-y-2">
                <Label htmlFor="usuario">Usuário</Label>
                <Input
                  id="usuario"
                  type="text"
                  placeholder="Digite seu usuário"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  required
                  disabled={carregando}
                  className="h-11"
                />
              </div>

              {/* Campo Senha */}
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <div className="relative">
                  <Input
                    id="senha"
                    type={mostrarSenha ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    disabled={carregando}
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    {mostrarSenha ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Mensagem de Erro */}
              {erro && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-sm text-red-600 dark:text-red-400 text-center">
                    {erro}
                  </p>
                </div>
              )}

              {/* Botão de Login */}
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                disabled={carregando}
              >
                {carregando ? (
                  'Entrando...'
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Entrar
                  </>
                )}
              </Button>
            </form>

            {/* Informações de Teste */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-600 dark:text-slate-400 text-center mb-3">
                Credenciais de teste:
              </p>
              <div className="space-y-2">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="default" className="text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      Administrador
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Usuário: <span className="font-mono font-semibold">admin</span>
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Senha: <span className="font-mono font-semibold">admin123</span>
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="secondary" className="text-xs">
                      <Building2 className="w-3 h-3 mr-1" />
                      Empresa
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Usuário: <span className="font-mono font-semibold">saborecia</span>
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Senha: <span className="font-mono font-semibold">123456</span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
          Sistema de Gestão de Entregas © 2024
        </p>
      </div>
    </div>
  );
}
