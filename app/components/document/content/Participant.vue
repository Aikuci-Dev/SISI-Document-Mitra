<script setup lang="ts">
import type { EmployeeInfo } from '~~/types/schema/document';

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
            <td>
              <slot
                name="supervisor-name"
                :value="employee.supervisor.name"
              >
                {{ employee.supervisor.name }}
              </slot>
            </td>
          </tr>
          <tr>
            <td class="w-[100px]">
              Jabatan
            </td>
            <td class="w-2">
              :
            </td>
            <td>
              <span class="italic">
                <slot
                  name="supervisor-role"
                  :value="employee.supervisor.role"
                >
                  {{ employee.supervisor.role }}
                </slot>
              </span> PT. Sinergi Informatika Semen Indonesia
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
            <td>
              <slot
                name="employee-name"
                :value="employee.name"
              >
                {{ employee.name }}
              </slot>
            </td>
          </tr>
          <tr>
            <td class="w-[100px]">
              Jabatan
            </td>
            <td class="w-2">
              :
            </td>
            <td>
              <span class="italic">
                <slot
                  name="employee-role"
                  :value="employee.role"
                >
                  {{ employee.role }}
                </slot>
              </span>
            </td>
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
