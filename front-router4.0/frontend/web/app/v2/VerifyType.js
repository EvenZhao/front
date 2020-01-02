import React from 'react'

//验证码种类
export const VerifyType={
  // 0： 注册
  REGISTER_VERIFY:0,
  // 1： 快捷登录
  LOGIN_VERIFY:1,
  // 2： 修改密码
  UPDATE_PWD_VERIFY:2,
  // 3： 修改手机第一步(验证)
  UPDATE_PHONE_FIRST_STEP:3,
  // 4： 修改(绑定)手机第二步
  UPDATE_PHONE_SECOND_STEP:4,
  // 5： 修改邮箱第一步(验证)
  UPDATE_EMAIL_FIRST_STEP:5,
  // 6： 修改(绑定)邮箱第二步
  UPDATE_EMAIL_SECOND_STEP:6,
  // 7： 员工帐号绑定手机
  EMP_ACCOUNT_BIND_PHONE:7,
}






export default VerifyType;
