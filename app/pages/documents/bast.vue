<template>
  <NuxtLayout name="documents">
    <template #header>
      BAST Document
    </template>

    <Documents>
      <template #header>
        <h1>BERITA ACARA SERAH TERIMA PEKERJAAN</h1>
        <h1>DETAILS.TITLE</h1>
        <h1 class="tw-text-[11pt] tw-font-normal">
          No: BAST.NUMBER
        </h1>
      </template>

      <div>
        <p>
          Pada hari ini, DETAILS.DAYS.END tanggal DETAILS.DATES.END, yang
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
              "DETAILS.TITLE" Berita Acara Pemeriksaan Pekerjaan No.
              BAPP.NUMBER tanggal DETAILS.DAYS.END
            </li>
          </ul>
        </div>
      </div>
      <div>
        <p>Kedua belah Pihak secara bersama-sama sepakat bahwa:</p>
        <p>
          <strong>PIHAK KEDUA</strong> telah menyelesaikan pekerjaan
          "DETAILS.TITLE" dan menyerahkan kepada
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
      <div class="tw-flex-justify-around tw-flex tw-text-center tw-font-bold">
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
    </Documents>
  </NuxtLayout>
</template>

<style scoped>
ul {
  @apply tw-list-disc;
}
</style>
