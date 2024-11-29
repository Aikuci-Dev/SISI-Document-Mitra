<script setup lang="ts">
import type { EmployeeInfo } from '~~/types/document';

defineProps<{ employee: EmployeeInfo }>();
</script>

<template>
  <div>
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
            <td>{{ employee.supervisor.name }}</td>
          </tr>
          <tr>
            <td class="w-[100px]">
              Jabatan
            </td>
            <td class="w-2">
              :
            </td>
            <td>
              <span class="italic">{{ employee.supervisor.role }}</span> PT. Sinergi Informatika Semen Indonesia
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
            <td>{{ employee.name }}</td>
          </tr>
          <tr>
            <td class="w-[100px]">
              Jabatan
            </td>
            <td class="w-2">
              :
            </td>
            <td><span class="italic">{{ employee.role }}</span></td>
          </tr>
          <tr>
            <td colspan="3">
              Selanjutnya disebut sebagai "<strong>PIHAK KEDUA</strong>"
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
