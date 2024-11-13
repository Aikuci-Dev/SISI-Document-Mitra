<script setup lang="ts">
// https://nuxt.com/docs/getting-started/seo-meta#external-css
useHead({
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: '',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap',
      crossorigin: '',
    },
  ],
});
</script>

<template>
  <div class="tw-flex tw-max-h-screen tw-flex-col">
    <h1 class="tw-p-8 tw-text-4xl tw-font-bold tw-tracking-tight">
      BAPP Document
    </h1>
    <div class="tw-flex tw-justify-center tw-overflow-auto tw-bg-slate-100">
      <div class="page">
        <div class="content">
          <div class="header">
            <h1>BERITA ACARA PEMERIKSAAN PEKERJAAN</h1>
            <h1>DETAILS.TITLE</h1>
            <h1 class="tw-text-[11pt] tw-font-normal">
              No: BAPP.NUMBER
            </h1>
          </div>
          <div class="body">
            <div>
              <p>
                Pada hari ini, DETAILS.DAYS.END tanggal DETAILS.DATES.END, telah
                diselesaikan pekerjaan oleh pihak-pihak berikut :
              </p>
            </div>
            <div class="tw-px-12">
              <table class="tw-w-full">
                <tbody>
                  <tr>
                    <td class="tw-w-[100px]">
                      Nama
                    </td>
                    <td>:</td>
                    <td>EMPLOYEE.SUPERVISOR.NAME</td>
                  </tr>
                  <tr>
                    <td class="tw-w-[100px]">
                      Jabatan
                    </td>
                    <td>:</td>
                    <td>
                      <span class="tw-italic">Project Manager</span> PT. Sinergi
                      Informatika Semen Indonesia
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3">
                      Selanjutnya disebut sebagai
                      <strong>"PIHAK PERTAMA"</strong>
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
                    <td>:</td>
                    <td>EMPLOYEE.NAME</td>
                  </tr>
                  <tr>
                    <td class="tw-w-[100px]">
                      Jabatan
                    </td>
                    <td>:</td>
                    <td><span class="tw-italic">Developer</span></td>
                  </tr>
                  <tr>
                    <td colspan="3">
                      Selanjutnya disebut sebagai <strong>"PIHAK KEDUA"</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <p>Dengan berdasarkan:</p>
              <div class="tw-ml-16">
                <ul class="tw-indent-4">
                  <li>
                    Surat Perintah Kerja No. PO.NUMBER perihal Pengadaan
                    "DETAILS.TITLE"
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
                  atas DETAILS.TITLE dari tanggal DETAILS.DATES.START -
                  DETAILS.DATES.END dengan detail sebagai berikut :
                </p>
              </div>
              <div class="tw-px-12">
                <table class="tw-w-full">
                  <tbody>
                    <tr>
                      <td class="tw-w-[150px]">
                        Nomor PO
                      </td>
                      <td>:</td>
                      <td>PO.NUMBER</td>
                    </tr>
                    <tr>
                      <td class="tw-w-[150px]">
                        Nomor Invoice
                      </td>
                      <td>:</td>
                      <td>INVOICE.NUMBER</td>
                    </tr>
                    <tr>
                      <td class="tw-w-[150px]">
                        Nominal Invoice
                      </td>
                      <td>:</td>
                      <td>INVOICE.NOMINAL</td>
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
            <div
              class="tw-flex-justify-around tw-flex tw-text-center tw-font-bold"
            >
              <div class="tw-basis-1/2">
                <div>PIHAK PERTAMA</div>
                <div>PT. Sinergi Informatika Semen Indonesia</div>
                <div class="tw-h-[140px]" />
                <div class="tw-underline tw-decoration-2">
                  EMPLOYEE.SUPERVISOR.NAME
                </div>
                <div class="tw-font-normal tw-italic">
                  Project Manager
                </div>
              </div>
              <div class="tw-basis-1/2">
                <div>PIHAK KEDUA</div>
                <div>&nbsp;</div>
                <div class="tw-h-[140px]" />
                <div class="tw-underline tw-decoration-2">
                  EMPLOYEE.NAME
                </div>
                <div class="tw-font-normal tw-italic">
                  Developer
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="footer"></div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@page {
  size: A4;
  margin: 0;
}

.page {
  @apply tw-m-0 tw-h-[297mm] tw-w-[210mm] tw-border tw-border-black tw-bg-white tw-p-0 print:tw-border-none;
}

.content {
  @apply tw-flex tw-flex-col tw-gap-8 tw-px-16 tw-py-24 tw-text-justify tw-leading-6;
}
.header {
  @apply tw-text-center tw-font-montserrat tw-text-[12pt] tw-font-bold;
}
.body {
  @apply tw-flex tw-flex-col tw-gap-4 tw-py-4 tw-text-[11pt];
}
/* .footer {
} */

ul {
  @apply tw-list-disc;
}
</style>
