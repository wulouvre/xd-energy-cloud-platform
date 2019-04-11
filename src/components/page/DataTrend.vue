<template>
  <div>
    <div>
      <el-select v-model="value">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>

      <div style="margin-top: 20px;">
        起始时间：
        <el-date-picker v-model="value1" type="datetime" placeholder="选择日期时间">
        </el-date-picker>
        <el-select v-model="value">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        时间长度：
        <el-input-number v-model="num1" @change="handleChange" :min="1" :max="10" label="描述文字"></el-input-number>
        <el-select v-model="value">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>

        <el-button type="primary">预览/打印</el-button>
        <el-button type="primary" icon="el-icon-search">更新</el-button>

        曲线：
        <i class="el-icon-share"></i>
      </div>

      <el-table :data="tableData" style="width: 100%;margin-top: 40px;">
        <el-table-column prop="number" label="序号">
        </el-table-column>
        <el-table-column prop="variable" label="变量名">
        </el-table-column>
        <el-table-column prop="time" label="时间">
        </el-table-column>
        <el-table-column prop="value" label="数值">
        </el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" :total="1000">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {
          value: "1",
          label: "数据曲线"
        },
        {
          value: "2",
          label: "数据表格"
        }
      ],
      value: "2",
      tableData: [
        {
          number: "01",
          variable: "P1_DOC2",
          time: "2018-08-02 09:46:18",
          value: "0.82731"
        },
        {
          number: "02",
          variable: "P1_DOC2",
          time: "2018-08-02 09:46:18",
          value: "0.82731"
        }
      ]
    };
  },
  components: {}
};
</script>

<style>
</style>
