import { IClientsRepository, IInvoicesRepository, ISettingsRepository } from './repository.interface';
import { LocalClientsRepository, LocalInvoicesRepository, LocalSettingsRepository } from './local/repositories';
import { SupabaseClientsRepository, SupabaseInvoicesRepository, SupabaseSettingsRepository } from './supabase/repositories';

// DATA_SOURCE can be injected via env variables later
const DATA_SOURCE = process.env.DATA_SOURCE || 'local';

let clientsRepository: IClientsRepository;
let invoicesRepository: IInvoicesRepository;
let settingsRepository: ISettingsRepository;

if (DATA_SOURCE === 'local') {
  clientsRepository = new LocalClientsRepository();
  invoicesRepository = new LocalInvoicesRepository();
  settingsRepository = new LocalSettingsRepository();
} else {
  clientsRepository = new SupabaseClientsRepository();
  invoicesRepository = new SupabaseInvoicesRepository();
  settingsRepository = new SupabaseSettingsRepository();
}

export { clientsRepository, invoicesRepository, settingsRepository };
