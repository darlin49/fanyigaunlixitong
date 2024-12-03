package com.example.fnayiguanli;

import com.example.fnayiguanli.DanCi;
import com.example.fnayiguanli.DanCiService;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:8080")
@Slf4j
public class DanCiController {

    @Autowired
    private DanCiService danCiService;

    // 查询所有单词
    @GetMapping("/words")
    public List<DanCi> getAllWords() {
        log.info("正在获取所有单词...");
        try {
            List<DanCi> words = danCiService.list();
            log.info("成功获取到 {} 个单词", words.size());
            return words;
        } catch (Exception e) {
            log.error("获取单词列表失败", e);
            throw e;
        }
    }

    // 添加一个测试接口
    @GetMapping("/test")
    public String test() {
        log.info("测试接口被调用");
        return "API 工作正常";
    }

    // 根据单词查询
    @GetMapping("/words/search")
    public List<DanCi> getWordByName(@RequestParam String name) {
        System.out.println("搜索单词: " + name);
        QueryWrapper<DanCi> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("word", name);
        return danCiService.list(queryWrapper);
    }

    // 添加新单词
    @PostMapping("/words")
    public DanCi addWord(@RequestBody DanCi word) {
        danCiService.save(word);
        return word;
    }

    // 更新单词
    @PutMapping("/words/{id}")
    public boolean updateWord(@PathVariable Integer id, @RequestBody DanCi word) {
        word.setId(id);
        return danCiService.updateById(word);
    }

    // 删除单词
    @DeleteMapping("/words/{id}")
    public boolean deleteWord(@PathVariable Integer id) {
        return danCiService.removeById(id);
    }
}