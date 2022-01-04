import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { InvoiceItemCategory } from '../../invoices/entities/invoice-item-category.entity';

export default class CreateInvoiceItemCategories implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(InvoiceItemCategory)
      .values([
        {
          name: 'Sprzedaz towarów PARAGONOWA',
          symbol: 'Sprzedaz towarów PARAGONOWA',
          typeNo: '700-11',
        },
        { name: 'Sprzedaz ST', symbol: 'Sprzedaz ST', typeNo: '700-11' },
        {
          name: 'Sprzedaz pozostala',
          symbol: 'SPRZEDAZ_POZOSTALA',
          typeNo: '700-99',
        },
        {
          name: 'Sprzedaz towarów EKSPORTOWA',
          symbol: 'Sprzedaz towarów EKSPORTOWA',
          typeNo: '700-12',
        },
        {
          name: 'Odsetki uzyskane',
          symbol: 'Odsetki uzyskane',
          typeNo: '700-12',
        },
        {
          name: 'Odsetki od lokat',
          symbol: 'Odsetki od lokat',
          typeNo: '700-12',
        },
        {
          name: 'Odsetki od FV sprzed.',
          symbol: 'Odsetki od FV sprzed.',
          typeNo: '700-12',
        },
        {
          name: 'Odsetki rach.bankowy',
          symbol: 'Odsetki rach.bankowy',
          typeNo: '700-12',
        },
        { name: 'SPRZEDAZ WDT', symbol: 'SPRZEDAZ WDT', typeNo: '700-13' },
        {
          name: 'Róz.kursowe dod.',
          symbol: 'Róz.kursowe dod.',
          typeNo: '700-13',
        },
        {
          name: 'Sprzedaz- uslugi budowlane',
          symbol: 'Sprzedaz- uslugi budowlane',
          typeNo: '700-14',
        },
        {
          name: 'Sprzedaz materialów i opakowan',
          symbol: 'Sprzedaz materialów i opakowan',
          typeNo: '700-15',
        },
        {
          name: 'Sprzedaz - uslugi transportowe',
          symbol: 'Sprzedaz - uslugi transportowe',
          typeNo: '700-15',
        },
        {
          name: 'Sprzedaz - tylko VAT',
          symbol: 'Sprzedaz - tylko VAT',
          typeNo: '700-16',
        },
        {
          name: 'Faktura urzedówka',
          symbol: 'Faktura urzedówka',
          typeNo: '700-16',
        },
        { name: 'S(21) - WDT', symbol: 'S(21) - WDT', typeNo: '700-31' },
        {
          name: 'S(22) -eksport towarów',
          symbol: 'S(22) -eksport towarów',
          typeNo: '700-32',
        },
        {
          name: 'S(11)-dost.tow. i swiadcz. uslug poza teryt .UE',
          symbol: 'S(11)-dost.tow. i swiadcz.uslug poza teryt.UE',
          typeNo: '700-21',
        },
        {
          name: 'S(12/11+)-Swiadcz.uslug teryt .UE',
          symbol: 'S(12/11+)-Swiadcz.uslug teryt.UE',
          typeNo: '700-22',
        },
        { name: 'S(23) WNT', symbol: 'S(23) WNT', typeNo: '700-33' },
        {
          name: 'S(25) Import towarów',
          symbol: 'S(25) Import towarów',
          typeNo: '700-35',
        },
        {
          name: 'S(27) Import uslug poza UE',
          symbol: 'S(27) Import uslug poza UE',
          typeNo: '700-37',
        },
        {
          name: 'S(29) Import uslug UE',
          symbol: 'S Import uslug UE',
          typeNo: '700-39',
        },
        {
          name: 'S(31) OO - towary',
          symbol: 'S(31) Sprzedaz zlomu',
          typeNo: '700-41',
        },
        {
          name: 'Dodatnie róznice kursowe',
          symbol: 'Dodatnie róznice kursowe',
          typeNo: '700-99',
        },
        {
          name: 'S(21) - WDT transakcje trójstronne',
          symbol: 'S(21) - WDT transakcje trójstronne',
          typeNo: '700-31-1',
        },
        {
          name: 'S(23) WNT transakcje trójstronne',
          symbol: 'S(23) WNT transakcje trójstronne',
          typeNo: '700-33-1',
        },
        {
          name: 'Sprzedaz towarów FAKTUROWANA',
          symbol: 'SPRZEDAZ_TOWAROW_FAKTUROWANA',
          typeNo: '700-10',
        },
        {
          name: 'Kursy i szkolenia',
          symbol: 'Kursy i szkolenia',
          typeNo: '700-10',
        },
        {
          name: 'Sprzedaz nieruchomosci',
          symbol: 'Sprzedaz nieruchomosci',
          typeNo: '700-10',
        },
        {
          name: 'Sprzedaz uslug prawnych',
          symbol: 'Sprzedaz uslug prawnych',
          typeNo: '700-10',
        },
        {
          name: 'Uslugi projektowe',
          symbol: 'Uslugi projektowe',
          typeNo: '700-10',
        },
        {
          name: 'Sprzedaz reklama/marketing',
          symbol: 'Sprzedaz reklama/marketing',
          typeNo: '700-10',
        },
        { name: 'Ubezpieczenia', symbol: 'Ubezpieczenia', typeNo: '700-10' },
        {
          name: 'Uslugi finansowe',
          symbol: 'Uslugi finansowe',
          typeNo: '700-10',
        },
        {
          name: 'Sprzedaz uslug IT',
          symbol: 'Sprzedaz uslug IT',
          typeNo: '700-10',
        },
        {
          name: 'Uslugi konsultingowe',
          symbol: 'Uslugi konsultingowe',
          typeNo: '700-10',
        },
        {
          name: 'FV do paragonu ( bez Kpir , bez rej.VAT)',
          symbol: 'FV do paragonu ( bez Kpir , bez rej.VAT)',
          typeNo: '700-00',
        },
        {
          name: 'Odwrotne obciazenie',
          symbol: 'Odwrotne obciazenie',
          typeNo: '700-41_1',
        },
        {
          name: 'S(32)Odwr. obciazenie-dost.zagr.(wypel.nabywca)',
          symbol: 'S(32)Odwr. obciazenie-dost.zagr.(wypel.nabywca)',
          typeNo: '700-41_1',
        },
        {
          name: 'S(34)Odwr. obciazenie-dost.kraj.(wypelnia.nabywca)',
          symbol: 'S(34)Odwr. obciazenie-dost.kraj.(wypel.nabywca)',
          typeNo: '700-41_2',
        },
        {
          name: 'S(31)Odwr. obciazenie (wypeln.dostawca)',
          symbol: 'S(31)Odwr. obciazenie (wypeln.dostawca)',
          typeNo: '700-41_3',
        },
        {
          name: 'S(31)OO - uslugi (wypeln.dost.)',
          symbol: 'S(31)Odwr.obciazenie(wypeln.dostawca)',
          typeNo: '700-41U',
        },
        { name: 'Sprz.MPP', symbol: 'Sprz.MPP', typeNo: '700-MPP' },
        { name: 'Pakiet', symbol: 'sale_pakiet', typeNo: '700-10' },
        { name: 'Darowizna', symbol: 'Darowizna', typeNo: '700-16' },
      ])
      .execute();
  }
}
