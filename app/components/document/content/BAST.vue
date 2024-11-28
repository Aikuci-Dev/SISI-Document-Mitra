<script setup lang="ts">
import type { WorkDocument } from '~~/types/document';

interface Props {
  data: WorkDocument & { bast: { number: string } };
}

const props = defineProps<Props>();

const dayEnd = computed(() => new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(new Date(props.data.details.date.ts.end)));
const dateEnd = computed(() => new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(props.data.details.date.ts.end)));
</script>

<template>
  <Document>
    <template #header>
      <h1>BERITA ACARA SERAH TERIMA PEKERJAAN</h1>
      <h1>{{ data.details.title }}</h1>
      <h1 class="text-[11pt] font-normal">
        No: {{ data.bast.number }}
      </h1>
    </template>

    <template #body>
      <div>
        <p>
          Pada hari ini, {{ dayEnd }} tanggal {{ dateEnd }}, yang bertanda tangan di bawah ini:
        </p>
      </div>
      <div class="px-12">
        <table class="w-full">
          <tbody>
            <tr>
              <td class="w-[100px]">
                Nama
              </td>
              <td class="w-2">
                :
              </td>
              <td>{{ data.employee.supervisor.name }}</td>
            </tr>
            <tr>
              <td class="w-[100px]">
                Jabatan
              </td>
              <td class="w-2">
                :
              </td>
              <td>
                <span class="italic">{{ data.employee.supervisor.role }}</span> PT. Sinergi Informatika Semen Indonesia
              </td>
            </tr>
            <tr>
              <td colspan="3">
                Selanjutnya disebut sebagai "<strong>PIHAK PERTAMA</strong>"
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-12">
        <table class="w-full">
          <tbody>
            <tr>
              <td class="w-[100px]">
                Nama
              </td>
              <td class="w-2">
                :
              </td>
              <td>{{ data.employee.name }}</td>
            </tr>
            <tr>
              <td class="w-[100px]">
                Jabatan
              </td>
              <td class="w-2">
                :
              </td>
              <td><span class="italic">{{ data.employee.role }}</span></td>
            </tr>
            <tr>
              <td colspan="3">
                Selanjutnya disebut sebagai "<strong>PIHAK KEDUA</strong>"
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <p>Dengan berdasarkan:</p>
        <div class="ml-16">
          <ul class="list-disc indent-4">
            <li>
              Surat Perintah Kerja No. {{ data.po.number }} perihal Pengadaan "{{ data.details.title }}" Berita Acara Pemeriksaan Pekerjaan No. {{ data.bapp.number }} tanggal {{ dateEnd }}
            </li>
          </ul>
        </div>
      </div>
      <div>
        <p>Kedua belah Pihak secara bersama-sama sepakat bahwa:</p>
        <p>
          <strong>PIHAK KEDUA</strong> telah menyelesaikan pekerjaan "{{ data.details.title }}" dan menyerahkan kepada <strong>PIHAK PERTAMA</strong>.
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
      <DocumentContentSign :employee="data.employee" />
    </template>
  </Document>
</template>
