<script setup lang="ts">
import { useDateFormat } from '@vueuse/core';
import { formatCurrency } from '~/lib/utils';
import type { WorkDocument } from '~~/types/schema/document';

const props = defineProps<{ data: WorkDocument }>();

const dateStart = useDateFormat(new Date(props.data.details.date.ts.start), 'DD MMMM YYYY', { locales: 'id-ID' });
const dateEnd = useDateFormat(new Date(props.data.details.date.ts.end), 'DD MMMM YYYY', { locales: 'id-ID' });
const dayEnd = useDateFormat(new Date(props.data.details.date.ts.end), 'dddd', { locales: 'id-ID' });
</script>

<template>
  <Document>
    <template #header>
      <h1>BERITA ACARA PEMERIKSAAN PEKERJAAN</h1>
      <h1>
        <slot
          name="details-title"
          :value="data.details.title"
        >
          {{ data.details.title }}
        </slot>
      </h1>
      <h1 class="text-[11pt] font-normal">
        No:
        <slot
          name="bapp-number"
          :value="data.bapp.number"
        >
          {{ data.bapp.number }}
        </slot>
      </h1>
    </template>

    <template #body>
      <div>
        <p>
          Pada hari ini,
          <slot
            name="details-day-end"
            :value="data.details.date.ts.end"
          >
            {{ dayEnd }}
          </slot>
          tanggal
          <slot
            name="details-date-end"
            :value="data.details.date.ts.end"
          >
            {{ dateEnd }}
          </slot>
          , telah diselesaikan pekerjaan oleh pihak-pihak berikut:
        </p>
      </div>

      <slot
        name="section-participant"
        :value="data.employee"
      >
        <DocumentContentSectionParticipantDefault :employee="data.employee" />
      </slot>

      <div>
        <p>Dengan berdasarkan:</p>
        <div class="ml-16">
          <ul class="list-disc indent-4">
            <li>
              Surat Perintah Kerja No.
              <slot
                name="po-number"
                :value="data.po.number"
              >
                {{ data.po.number }}
              </slot>
              perihal Pengadaan
              <span>
                "<slot
                  name="details-title"
                  :value="data.details.title"
                >
                  {{ data.details.title }}
                </slot>"
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <div>
          <p>
            Dengan ini menyatakan bahwa <strong>PIHAK KEDUA</strong> telah melaksanakan pekerjaan kepada <strong>PIHAK PERTAMA</strong> berupa layanan Jasa Developer atas
            <slot
              name="details-title"
              :value="data.details.title"
            >
              {{ data.details.title }}
            </slot>
            dari tanggal
            <slot
              name="details-date-start"
              :value="data.details.date.ts.start"
            >
              {{ dateStart }}
            </slot>
            -
            <slot
              name="details-date-end"
              :value="data.details.date.ts.end"
            >
              {{ dateEnd }}
            </slot>
            dengan detail sebagai berikut:
          </p>
        </div>
        <div class="px-12">
          <table class="w-full">
            <tbody>
              <tr>
                <td class="w-[150px]">
                  Nomor PO
                </td>
                <td class="w-2">
                  :
                </td>
                <td>
                  <slot
                    name="po-number"
                    :value="data.po.number"
                  >
                    {{ data.po.number }}
                  </slot>
                </td>
              </tr>
              <tr>
                <td class="w-[150px]">
                  Nomor Invoice
                </td>
                <td class="w-2">
                  :
                </td>
                <td>
                  <slot
                    name="invoice-number"
                    :value="data.invoice.number"
                  >
                    {{ data.invoice.number }}
                  </slot>
                </td>
              </tr>
              <tr>
                <td class="w-[150px]">
                  Nominal Invoice
                </td>
                <td class="w-2">
                  :
                </td>
                <td>
                  <slot
                    name="invoice-nominal"
                    :value="data.invoice.nominal"
                  >
                    {{ formatCurrency(data.invoice.nominal) }}
                  </slot>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <p>
          Demikian Berita Acara Pemeriksaan Pekerjaan ini dibuat untuk dipergunakan sebagaimana mestinya.
        </p>
      </div>
      <div />
      <div />

      <slot
        name="section-sign"
        :value="data.employee"
      >
        <DocumentContentSectionSignDefault :employee="data.employee" />
      </slot>
    </template>
  </Document>
</template>
