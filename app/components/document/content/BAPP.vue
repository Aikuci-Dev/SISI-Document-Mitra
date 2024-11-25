<script setup lang="ts">
import type { WorkDocument } from '~~/types/document';

interface Props {
  data: WorkDocument;
}

defineProps<Props>();
</script>

<template>
  <Document>
    <template #header>
      <h1>BERITA ACARA PEMERIKSAAN PEKERJAAN</h1>
      <h1>{{ data.details.title }}</h1>
      <h1 class="tw-text-[11pt] tw-font-normal">
        No: {{ data.bapp.number }}
      </h1>
    </template>

    <template #body>
      <div>
        <p>
          Pada hari ini, {{ data.details.date.date.end }} tanggal {{ data.details.date.date.end }}, telah
          diselesaikan pekerjaan oleh pihak-pihak berikut:
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
              "{{ data.details.title }}"
            </li>
          </ul>
        </div>
      </div>
      <div>
        <div>
          <p>
            Dengan ini menyatakan bahwa <strong>PIHAK KEDUA</strong> telah
            melaksanakan pekerjaan kepada
            <strong>PIHAK PERTAMA</strong> berupa layanan Jasa Developer
            atas {{ data.details.title }} dari tanggal {{ data.details.date.date.start }} -
            {{ data.details.date.date.end }} dengan detail sebagai berikut:
          </p>
        </div>
        <div class="tw-px-12">
          <table class="tw-w-full">
            <tbody>
              <tr>
                <td class="tw-w-[150px]">
                  Nomor PO
                </td>
                <td class="tw-w-2">
                  :
                </td>
                <td>{{ data.po.number }}</td>
              </tr>
              <tr>
                <td class="tw-w-[150px]">
                  Nomor Invoice
                </td>
                <td class="tw-w-2">
                  :
                </td>
                <td>{{ data.invoice.number }}</td>
              </tr>
              <tr>
                <td class="tw-w-[150px]">
                  Nominal Invoice
                </td>
                <td class="tw-w-2">
                  :
                </td>
                <td>{{ data.invoice.nominal }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <p>
          Demikian Berita Acara Pemeriksaan Pekerjaan ini dibuat untuk
          dipergunakan sebagaimana mestinya.
        </p>
      </div>
      <div />
      <div />
      <DocumentContentSign :employee="data.employee" />
    </template>
  </Document>
</template>
