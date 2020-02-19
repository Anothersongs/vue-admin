<template>
    <div id="login">
        <div class="login-wrap">
            <ul class="menu-tab">
                <li :class="{'current': item.current}" v-for="item in menuTab" :key="item.id" @click="toggleMneu(item)">{{ item.txt }}</li>
            </ul>
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="login-form" size="medium">
                <el-form-item  prop="username" class="item-form">
                    <label for="username">邮箱</label>
                    <el-input id="username" type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item  prop="password" class="item-form">
                    <label for="password">密码</label>
                    <el-input id="password" type="password" v-model="ruleForm.password" autocomplete="off" maxlength="20" minlength="6"></el-input>
                </el-form-item>

                <el-form-item  prop="passwords" class="item-form" v-show= "model === 'register'">
                    <label>重复密码</label>
                    <el-input type="password" v-model="ruleForm.passwords" autocomplete="off" maxlength="20" minlength="6"></el-input>
                </el-form-item>

                <el-form-item  prop="code" class="item-form">
                    <label>验证码</label>
                    <el-row :gutter="10">
                        <el-col :span="15">
                            <el-input v-model.number="ruleForm.code" maxlength="6" minlength="6"></el-input>
                        </el-col>
                        <el-col :span="9">
                            <el-button type="success" class="block" @click="getSms()" >获取验证码</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>

                <el-form-item>
                    <el-button type="danger" @click="submitForm('ruleForm')" class="login-btn block" :disabled="loginButtonStatus">{{ model === 'login' ? "登录" : "注册" }}</el-button>
            </el-form-item>
</el-form>
        </div>
    </div>
</template>
<script>
import { GetSms } from '@/api/login'
import { reactive, ref, onMounted } from '@vue/composition-api'
import { stripscript, validateEmail, validatePass, validateVCode } from '@/utils/validate.js'; //过滤函数的方法保存在./src/utils/validate.js中，用此语句可直接引用
export default{
  name: 'login',
  setup(props, { refs, root }){
  // setup(props, context){
    //这里面放置data数据，生命周期，自定义的函数。
     //验证用户名
      let validateUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else if(validateEmail(value)){
            callback(new Error('用户名格式有误'))
        }else{
          callback(); 
        }
      };
      //验证密码
      let validatePassword = (rule, value, callback) => {
        // 过滤后的数据
        ruleForm.password = stripscript(value);
        // console.log(this.ruleForm.password,value);
        // value为用户输入的值
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (validatePass(value)) {
          callback(new Error('密码为6至20位数字+字母'));
        } else if (ruleForm.password != value) {
          callback(new Error('密码含有非法字符'));
        } else {
          callback();
        }
      };
      //验证重复密码
      let validatePasswords = (rule, value, callback) => {
        //如果模块值为login则直接通过
        if(model.value ==='login') { callback(); }
        // 过滤后的数据
        ruleForm.passwords = stripscript(value);
        // console.log(ruleForm.password,value);
        // value为用户输入的值
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value != ruleForm.password) {
          callback(new Error('两次密码输入不一致'));
        } else {
          callback();
        }
      };
      //验证验证码
      let validateCode = (rule, value, callback) => {
      // 过滤后的数据
      ruleForm.code = stripscript(value);
        if (value === '') {
          return callback(new Error('请输入验证码'));
        } else if (validateVCode(value)){
            return callback(new Error('验证码格式有误'));
        } else if (ruleForm.code != value) {
          callback(new Error('验证码含有非法字符'));
        } else {
          callback();
        }
      };
    /**
     * 声明数据
     */
    const menuTab = reactive([
      { txt:'登录', current:true, type: 'login' },  //表单的数据
      { txt:'注册', current:false, type: 'register' }
     ])
     
     // 模块值
    const model = ref('login')
    // 登录按钮禁用状态
    const loginButtonStatus = ref(true);
    // 表单绑定数据
    const ruleForm = reactive({
      username: '',
      password: '',
      passwords: '',
      code: ''
    })
    //表单的验证
    const rules = reactive({
          username: [
            { validator: validateUsername, trigger: 'blur' }
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' }
          ],
          passwords: [
            { validator: validatePasswords, trigger: 'blur' }
          ],
          code: [
            { validator: validateCode, trigger: 'blur' }
          ]
        })

    /**
     * 声明函数
     */
    const toggleMneu = (data => {
          menuTab.forEach(elem =>{
              elem.current = false
          });
          data.current = true
          //修改模块值，控制登陆和注册出现的重复密码文本框
          model.value = data.type
      })

      /**
       * 获取验证码
       */
      const getSms = (() => {
        //进行提示
        if(ruleForm.username == '') {
          root.$message.error('邮箱不能为空')
          return false
        }

        if(validateEmail(ruleForm.username)) {
          root.$message.error('邮箱格式有误，请重新输入');
          return false
        }



      //获取验证码
    let requestData = { 
        username: ruleForm.username,
        module: 'login' 
       }
      GetSms(requestData).then(response => {

      }).catch(error =>{

        })
      })

      /**
       * 提交表单
       */


    const submitForm  = (formName => {
/*       axios.request({
       method: 'get',
      url: '/user/12345',
      data: {
        firstName: 'Fred',
        lastName: 'Flintstone'
        }
      })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
      }); */


        context.refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      })

    /**
     * 生命周期
     */
     onMounted(() => {
     })

     return {
       menuTab,
       model,
       ruleForm,
       rules,
       toggleMneu,
       submitForm,
       getSms,
       loginButtonStatus
     }
     
  },
  created(){},
      //数据驱动视频渲染
      //传统JS是操作DOM元素
}
</script>
<style scoped lang="scss">
#login {
    height:100vh;
    background-color:#344a5f;
}
.login-wrap{
    width:330px;
    margin: auto;
}
.menu-tab{
    text-align: center;
    li{
        display:inline-block;
        width: 88px;
        line-height: 36px;
        font-size: 14px;
        color: #fff;
        border-radius: 2px;
        cursor:pointer;
    }
    .current{
        background-color:rgba(0,0,0,.1);
    }
}
.login-form {
    margin-top: 29px;
    label {
        display: block;
        margin-bottom: 3px;
        font-size: 14px;
        color: #fff;
    }
    .item-form {
        margin-bottom: 13px;
    }
    .block {
        display: block;
        width: 100%;
    }
    .login-btn { margin-top: 19px; }
}
</style>