import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { insertUserSchema } from '@shared/schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import type { User } from '@shared/schema';

// Extend the insert schema with validation
const userFormSchema = insertUserSchema.extend({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type FormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  editingUser: User | null;
  onCancelEdit: () => void;
}

export function UserForm({ editingUser, onCancelEdit }: UserFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  // Update form when editing user changes
  useEffect(() => {
    if (editingUser) {
      setValue('name', editingUser.name);
      setValue('email', editingUser.email);
    } else {
      reset();
    }
  }, [editingUser, setValue, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      if (editingUser) {
        // Update user
        const response = await fetch(`/api/users/${editingUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        
        if (response.ok) {
          toast({
            title: 'Success',
            description: result.message,
          });
          reset();
          onCancelEdit();
          queryClient.invalidateQueries({ queryKey: ['/api/users'] });
        } else {
          toast({
            title: 'Error',
            description: result.message,
            variant: 'destructive',
          });
        }
      } else {
        // Create user
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        
        if (response.ok) {
          toast({
            title: 'Success',
            description: result.message,
          });
          reset();
          queryClient.invalidateQueries({ queryKey: ['/api/users'] });
        } else {
          toast({
            title: 'Error',
            description: result.message,
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save user',
        variant: 'destructive',
      });
    }
  };

  const handleResetForm = () => {
    reset();
    onCancelEdit();
  };

  return (
    <section className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-semibold mb-6">{editingUser ? 'Edit User' : 'Add New User'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" id="userId" value={editingUser?.id || ''} />
        
        <div>
          <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Enter name"
            className={`shadow-sm ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-primary focus:border-primary block w-full sm:text-sm rounded-md`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="Enter email"
            className={`shadow-sm ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-primary focus:border-primary block w-full sm:text-sm rounded-md`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        
        <div className="flex justify-end pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleResetForm}
            className="mr-2"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : editingUser ? 'Update User' : 'Save User'}
          </Button>
        </div>
      </form>
    </section>
  );
}
