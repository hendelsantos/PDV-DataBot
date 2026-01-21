'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ClientesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
        <p className="text-gray-500">Gerencie seus clientes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-gray-500">Em desenvolvimento...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
