package com.example.fnayiguanli;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.fnayiguanli.DanCi;
import org.apache.ibatis.annotations.Mapper;

@Mapper  // 确保添加了 @Mapper 注解
public interface DanCiMapper extends BaseMapper<DanCi> {
    // 可以添加自定义查询方法
}
