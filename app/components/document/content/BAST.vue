<script setup lang="ts">
import { useDateFormat } from '@vueuse/core';
import type { WorkDocument } from '~~/types/schema/document';

const props = defineProps<{
  data: WorkDocument & { bast: { number: string } };
}>();

const dateEnd = useDateFormat(new Date(props.data.details.date.ts.end), 'DD MMMM YYYY', { locales: 'id-ID' });
const dayEnd = useDateFormat(new Date(props.data.details.date.ts.end), 'dddd', { locales: 'id-ID' });
</script>

<template>
  <Document>
    <template #header>
      <h1>BERITA ACARA SERAH TERIMA PEKERJAAN</h1>
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
          name="bast-number"
          :value="data.bast.number"
        >
          {{ data.bast.number }}
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
          , yang bertanda tangan di bawah ini:
        </p>
      </div>

      <DocumentContentParticipant :employee="data.employee">
        <template #supervisor-name="{ value }">
          <slot
            name="supervisor-name"
            :value
          >
            {{ value }}
          </slot>
        </template>
        <template #supervisor-role="{ value }">
          <slot
            name="supervisor-role"
            :value
          >
            {{ value }}
          </slot>
        </template>
        <template #employee-name="{ value }">
          <slot
            name="employee-name"
            :value
          >
            {{ value }}
          </slot>
        </template>
        <template #employee-role="{ value }">
          <slot
            name="employee-role"
            :value
          >
            {{ value }}
          </slot>
        </template>
      </DocumentContentParticipant>

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
              Berita Acara Pemeriksaan Pekerjaan No.
              <slot
                name="bapp-number"
                :value="data.bapp.number"
              >
                {{ data.bapp.number }}
              </slot>
              tanggal
              <slot
                name="details-date-end"
                :value="data.details.date.ts.end"
              >
                {{ dateEnd }}
              </slot>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <p>Kedua belah Pihak secara bersama-sama sepakat bahwa:</p>
        <p>
          <strong>PIHAK KEDUA</strong> telah menyelesaikan pekerjaan
          <span>
            "<slot
              name="details-title"
              :value="data.details.title"
            >
              {{ data.details.title }}
            </slot>"
          </span>
          dan menyerahkan kepada <strong>PIHAK PERTAMA</strong>.
        </p>
        <p>
          <strong>PIHAK PERTAMA</strong> menerima baik penyerahan dari <strong>PIHAK KEDUA</strong> berupa pekerjaan tersebut diatas.
        </p>
      </div>
      <div>
        <p>
          Demikian Berita Acara Serah Terima Pekerjaan ini dibuat untuk dipergunakan sebagaimana mestinya.
        </p>
      </div>
      <div />
      <div />

      <DocumentContentSign :employee="data.employee">
        <template #supervisor-alias="{ value }">
          <slot
            name="supervisor-alias"
            :value
          >
            {{ value }}
          </slot>
        </template>
        <template #supervisor-company="{ value }">
          <slot
            name="supervisor-company"
            :value
          >
            {{ value }}
          </slot>
        </template>
        <template #supervisor-name="{ value }">
          <slot
            name="supervisor-name"
            :value
          >
            {{ value }}
          </slot>
        </template>
        <template #supervisor-role="{ value }">
          <slot
            name="supervisor-role"
            :value
          >
            {{ value }}
          </slot>
        </template>
        <template #employee-alias="{ value }">
          <slot
            name="employee-alias"
            :value
          >
            {{ value }}
          </slot>
        </template>
        <template #employee-company="{ value }">
          <slot
            name="employee-company"
            :value
          >
            {{ value }}
          </slot>
        </template>
        <template #employee-name="{ value }">
          <slot
            name="employee-name"
            :value
          >
            {{ value }}
          </slot>
        </template>
        <template #employee-role="{ value }">
          <slot
            name="employee-role"
            :value
          >
            {{ value }}
          </slot>
        </template>
      </DocumentContentSign>
    </template>
  </Document>
</template>
