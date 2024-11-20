<script setup lang="ts">
const page = 'BAPP';

const form = ref<unknown>({});

function handleGenerate() {
  console.log('handleGenerate');
}
function handleExport() {
  // TODO: Implement export functionality
  // Similar to handleGenerate, but process it on server-side.
  console.log('handleExport');
}
function handleCreateBAST() {
  navigateTo('/documents/bast');
}
function handleViewBAST() {
  console.log('handleViewBAST');
}
</script>

<template>
  <div class="tw-grid tw-grid-cols-1">
    <NuxtLayout name="documents">
      <template #header>
        {{ page }} Document
      </template>

      <template #bodyHeader>
        <DocumentBreadcrumb :page />
      </template>
      <template #bodyLeft>
        <ShadcnCard>
          <ShadcnCardContent>
            <div class="tw-min-h-96">
              <div class="tw-flex tw-gap-4 tw-p-4">
                <ShadcnButton @click="handleExport">
                  Export
                </ShadcnButton>
                <ShadcnButton @click="handleCreateBAST">
                  Create BAST
                </ShadcnButton>
                <ShadcnButton @click="handleViewBAST">
                  View BAST
                </ShadcnButton>
              </div>
            </div>
          </ShadcnCardContent>
        </ShadcnCard>
      </template>
      <template #bodyContent>
        <Document>
          <template #header>
            <h1>BERITA ACARA PEMERIKSAAN PEKERJAAN</h1>
            <h1>DETAILS.TITLE</h1>
            <h1 class="tw-text-[11pt] tw-font-normal">
              No: BAPP.NUMBER
            </h1>
          </template>

          <template #body>
            <div>
              <p>
                Pada hari ini, DETAILS.DAYS.END tanggal DETAILS.DATES.END, telah
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
                    <td>EMPLOYEE.SUPERVISOR.NAME</td>
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
                    <td>EMPLOYEE.NAME</td>
                  </tr>
                  <tr>
                    <td class="tw-w-[100px]">
                      Jabatan
                    </td>
                    <td class="tw-w-2">
                      :
                    </td>
                    <td><span class="tw-italic">Developer</span></td>
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
                  DETAILS.DATES.END dengan detail sebagai berikut:
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
                      <td>PO.NUMBER</td>
                    </tr>
                    <tr>
                      <td class="tw-w-[150px]">
                        Nomor Invoice
                      </td>
                      <td class="tw-w-2">
                        :
                      </td>
                      <td>INVOICE.NUMBER</td>
                    </tr>
                    <tr>
                      <td class="tw-w-[150px]">
                        Nominal Invoice
                      </td>
                      <td class="tw-w-2">
                        :
                      </td>
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
              class="tw-flex tw-justify-around tw-text-center tw-font-bold"
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
          </template>
        </Document>
      </template>
      <template #bodyRight>
        <DocumentForm
          v-model="form"
          @generate="handleGenerate"
        />
      </template>
    </NuxtLayout>
  </div>
</template>

<style scoped>
ul {
  @apply tw-list-disc;
}
</style>
