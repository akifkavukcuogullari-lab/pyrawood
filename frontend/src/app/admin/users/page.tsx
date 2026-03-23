'use client';

import { useEffect, useState } from 'react';
import { apiGetPaginated } from '@/lib/api';
import { ENDPOINTS } from '@/lib/api-contract';
import { formatDate } from '@/lib/utils';
import type { User } from '@/lib/types';
import { DataTable, type Column } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await apiGetPaginated<User>(ENDPOINTS.ADMIN.USERS.LIST, {
          limit: 200,
        });
        setUsers(res.data ?? []);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : 'Failed to load users'
        );
      } finally {
        setIsLoading(false);
      }
    }
    loadUsers();
  }, []);

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (user) => (
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-pyra-walnut/10 text-xs font-medium text-pyra-walnut">
            {user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <span className="font-medium">{user.name}</span>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (user) => (
        <span className="text-sm text-muted-foreground">{user.email}</span>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (user) =>
        user.role === 'admin' ? (
          <Badge className="bg-pyra-gold/15 text-pyra-gold border-0">
            Admin
          </Badge>
        ) : (
          <Badge variant="secondary" className="border-0">
            Customer
          </Badge>
        ),
    },
    {
      key: 'createdAt',
      header: 'Joined',
      sortable: true,
      render: (user) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(user.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-playfair text-2xl font-semibold text-foreground">
          Users
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          View registered customers and admins
        </p>
      </div>

      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        searchPlaceholder="Search by name or email..."
        searchFn={(user, query) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
        }
        emptyMessage="No users found."
      />
    </div>
  );
}
