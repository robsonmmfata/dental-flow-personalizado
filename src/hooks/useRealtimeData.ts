
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useQueryClient } from '@tanstack/react-query';

export const useRealtimeData = () => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Canal para appointments
    const appointmentsChannel = supabase
      .channel('appointments-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments'
        },
        () => {
          // Invalidar todas as queries de appointments
          queryClient.invalidateQueries({ queryKey: ['appointments'] });
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    // Canal para patients
    const patientsChannel = supabase
      .channel('patients-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patients'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['patients'] });
        }
      )
      .subscribe();

    // Canal para doctors
    const doctorsChannel = supabase
      .channel('doctors-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'doctors'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['doctors'] });
        }
      )
      .subscribe();

    // Canal para transactions
    const transactionsChannel = supabase
      .channel('transactions-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['transactions'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(appointmentsChannel);
      supabase.removeChannel(patientsChannel);
      supabase.removeChannel(doctorsChannel);
      supabase.removeChannel(transactionsChannel);
    };
  }, [queryClient]);

  return { isConnected };
};
