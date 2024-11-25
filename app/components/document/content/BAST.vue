<script setup lang="ts">
import type { WorkDocument } from '~~/types/document';

interface Props {
  data: WorkDocument & { bast: { number: string } };
}

defineProps<Props>();
</script>

<template>
  <Document>
    <template #header>
      <h1>BERITA ACARA SERAH TERIMA PEKERJAAN</h1>
      <h1>{{ data.details.title }}</h1>
      <h1 class="tw-text-[11pt] tw-font-normal">
        No: {{ data.bast.number }}
      </h1>
    </template>

    <template #body>
      <div>
        <p>
          Pada hari ini, {{ data.details.date.date.end }} tanggal {{ data.details.date.date.end }}, yang
          bertanda tangan di bawah ini:
        </p>
      </div>
      <div class="tw-px-12">
        <table class="tw-w-full">
          <tbody>
            <tr>
              <td class="tw-w-[100px]">
                Nama
              </td>
              <td class="tw-w-2">
                :
              </td>
              <td>{{ data.employee.supervisor.name }}</td>
            </tr>
            <tr>
              <td class="tw-w-[100px]">
                Jabatan
              </td>
              <td class="tw-w-2">
                :
              </td>
              <td>
                <span class="tw-italic">Project Manager</span> PT. Sinergi
                Informatika Semen Indonesia
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
      <div class="tw-px-12">
        <table class="tw-w-full">
          <tbody>
            <tr>
              <td class="tw-w-[100px]">
                Nama
              </td>
              <td class="tw-w-2">
                :
              </td>
              <td>{{ data.employee.name }}</td>
            </tr>
            <tr>
              <td class="tw-w-[100px]">
                Jabatan
              </td>
              <td class="tw-w-2">
                :
              </td>
              <td><span class="tw-italic">{{ data.employee.role }}</span></td>
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
        <div class="tw-ml-16">
          <ul class="tw-list-disc tw-indent-4">
            <li>
              Surat Perintah Kerja No. {{ data.po.number }} perihal Pengadaan
              "{{ data.details.title }}" Berita Acara Pemeriksaan Pekerjaan No.
              {{ data.bapp.number }} tanggal {{ data.details.date.date.end }}
            </li>
          </ul>
        </div>
      </div>
      <div>
        <p>Kedua belah Pihak secara bersama-sama sepakat bahwa:</p>
        <p>
          <strong>PIHAK KEDUA</strong> telah menyelesaikan pekerjaan
          "{{ data.details.title }}" dan menyerahkan kepada
          <strong>PIHAK PERTAMA</strong>.
        </p>
        <p>
          <strong>PIHAK PERTAMA</strong> menerima baik penyerahan dari
          <strong>PIHAK KEDUA</strong> berupa pekerjaan tersebut diatas.
        </p>
      </div>
      <div>
        <p>
          Demikian Berita Acara Serah Terima Pekerjaan ini dibuat untuk
          dipergunakan sebagaimana mestinya.
        </p>
      </div>
      <div />
      <div />
      <DocumentContentSign :employee="data.employee" />
    </template>
  </Document>
</template>
