<script setup lang="ts">
import { useDateFormat } from '@vueuse/core';
import type { WorkDocument } from '~~/types/schema/document';

const props = defineProps<{ data: WorkDocument }>();

const dataDateEnd = computed(() => new Date(props.data.detailsDateTsEnd));

const dateEnd = useDateFormat(dataDateEnd, 'DD MMMM YYYY', { locales: 'id-ID' });
const dayEnd = useDateFormat(dataDateEnd, 'dddd', { locales: 'id-ID' });
</script>

<template>
  <Document>
    <template #header>
      <h1>BERITA ACARA SERAH TERIMA PEKERJAAN</h1>
      <h1>
        <slot
          name="details-title"
          :value="data.detailsTitle"
        >
          {{ data.detailsTitle }}
        </slot>
      </h1>
      <h1 class="text-[11pt] font-normal">
        No:
        <slot
          name="bast-number"
          :value="data.bastNumber"
        >
          {{ data.bastNumber }}
        </slot>
      </h1>
    </template>

    <template #body>
      <div>
        <p>
          Pada hari ini,
          <slot
            name="details-day-end"
            :value="data.detailsDateTsEnd"
          >
            {{ dayEnd }}
          </slot>
          tanggal
          <slot
            name="details-date-end"
            :value="data.detailsDateTsEnd"
          >
            {{ dateEnd }}
          </slot>
          , yang bertanda tangan di bawah ini:
        </p>
      </div>

      <slot
        name="section-participant"
        :value="data"
      >
        <DocumentContentSectionParticipantDefault :employee="data" />
      </slot>

      <div>
        <p>Dengan berdasarkan:</p>
        <div class="ml-16">
          <ul class="list-disc indent-4">
            <li>
              Surat Perintah Kerja No.
              <slot
                name="po-number"
                :value="data.poNumber"
              >
                {{ data.poNumber }}
              </slot>
              perihal Pengadaan
              <span>
                "<slot
                  name="details-title"
                  :value="data.detailsTitle"
                >
                  {{ data.detailsTitle }}
                </slot>"
              </span>
              Berita Acara Pemeriksaan Pekerjaan No.
              <slot
                name="bapp-number"
                :value="data.bappNumber"
              >
                {{ data.bappNumber }}
              </slot>
              tanggal
              <slot
                name="details-date-end"
                :value="data.detailsDateTsEnd"
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
              :value="data.detailsTitle"
            >
              {{ data.detailsTitle }}
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

      <slot
        name="section-sign"
        :value="data"
      >
        <DocumentContentSectionSignDefault :employee="data" />
      </slot>
    </template>
  </Document>
</template>
