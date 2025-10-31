package com.bookadmin.config;

import com.bookadmin.entity.Book;
import com.bookadmin.entity.Borrow;
import com.bookadmin.entity.Category;
import com.bookadmin.entity.User;
import com.bookadmin.enums.BorrowStatus;
import com.bookadmin.enums.UserRole;
import com.bookadmin.enums.UserSex;
import com.bookadmin.enums.UserStatus;
import com.bookadmin.repository.BookRepository;
import com.bookadmin.repository.BorrowRepository;
import com.bookadmin.repository.CategoryRepository;
import com.bookadmin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final BorrowRepository borrowRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // 检查是否已有数据
        if (categoryRepository.count() > 0) {
            return;
        }
        
        // 创建分类数据
        createCategories();
        
        // 创建用户数据
        createUsers();
        
        // 创建图书数据
        createBooks();
        
        // 创建借阅数据
        createBorrows();
    }
    
    private void createCategories() {
        // 一级分类
        Category fiction = new Category();
        fiction.setName("文学小说");
        fiction.setLevel(1);
        fiction.setParentLevel("0");
        categoryRepository.save(fiction);
        
        Category technology = new Category();
        technology.setName("科技技术");
        technology.setLevel(1);
        technology.setParentLevel("0");
        categoryRepository.save(technology);
        
        Category history = new Category();
        history.setName("历史传记");
        history.setLevel(1);
        history.setParentLevel("0");
        categoryRepository.save(history);
        
        // 二级分类
        Category chineseFiction = new Category();
        chineseFiction.setName("中国文学");
        chineseFiction.setLevel(2);
        chineseFiction.setParentLevel("1");
        chineseFiction.setParent(fiction);
        categoryRepository.save(chineseFiction);
        
        Category foreignFiction = new Category();
        foreignFiction.setName("外国文学");
        foreignFiction.setLevel(2);
        foreignFiction.setParentLevel("1");
        foreignFiction.setParent(fiction);
        categoryRepository.save(foreignFiction);
        
        Category programming = new Category();
        programming.setName("编程开发");
        programming.setLevel(2);
        programming.setParentLevel("2");
        programming.setParent(technology);
        categoryRepository.save(programming);
        
        Category ai = new Category();
        ai.setName("人工智能");
        ai.setLevel(2);
        ai.setParentLevel("2");
        ai.setParent(technology);
        categoryRepository.save(ai);
    }
    
    private void createUsers() {
        List<String> names = Arrays.asList(
            "张三", "李四", "王五", "赵六", "钱七", "孙八", "周九", "吴十",
            "郑十一", "王十二", "冯十三", "陈十四", "褚十五", "卫十六", "蒋十七", "沈十八",
            "韩十九", "杨二十", "朱二十一", "秦二十二", "尤二十三", "许二十四", "何二十五",
            "吕二十六", "施二十七", "张二十八", "孔二十九", "曹三十"
        );
        
        List<String> nickNames = Arrays.asList(
            "小明", "小红", "小刚", "小丽", "小强", "小美", "小华", "小芳",
            "小军", "小燕", "小伟", "小玲", "小杰", "小梅", "小涛", "小兰",
            "小峰", "小霞", "小斌", "小雪", "小亮", "小云", "小东", "小雨",
            "小南", "小晴", "小西", "小月", "小北", "小星"
        );
        
        Random random = new Random();
        
        for (int i = 0; i < 30; i++) {
            User user = new User();
            user.setName(names.get(i % names.size()) + (i + 1));
            user.setNickName(nickNames.get(i % nickNames.size()));
            user.setRole(i < 3 ? UserRole.ADMIN : UserRole.USER);
            user.setStatus(UserStatus.ON);
            user.setSex(i % 2 == 0 ? UserSex.MALE : UserSex.FEMALE);
            user.setCreatedAt(LocalDateTime.now().minusDays(random.nextInt(365)));
            userRepository.save(user);
        }
    }
    
    private void createBooks() {
        List<String> bookNames = Arrays.asList(
            "红楼梦", "西游记", "水浒传", "三国演义", "百年孤独", "1984", "活着", "平凡的世界",
            "Java核心技术", "Spring Boot实战", "Python编程", "机器学习实战", "深度学习", "算法导论",
            "数据结构与算法", "计算机网络", "操作系统", "数据库系统概念", "编译原理", "计算机组成原理",
            "史记", "资治通鉴", "明朝那些事儿", "万历十五年", "中国历代政治得失", "人类简史",
            "未来简史", "今日简史", "时间简史", "宇宙简史"
        );
        
        List<String> authors = Arrays.asList(
            "曹雪芹", "吴承恩", "施耐庵", "罗贯中", "加西亚·马尔克斯", "乔治·奥威尔", "余华", "路遥",
            "Cay S. Horstmann", "Craig Walls", "Mark Lutz", "Peter Harrington", "Ian Goodfellow", "Thomas H. Cormen",
            "Robert Sedgewick", "Andrew S. Tanenbaum", "Abraham Silberschatz", "Alfred V. Aho", "David A. Patterson",
            "司马迁", "司马光", "当年明月", "黄仁宇", "钱穆", "尤瓦尔·赫拉利", "史蒂芬·霍金", "卡尔·萨根"
        );
        
        List<String> descriptions = Arrays.asList(
            "这是一部经典文学作品", "这是一部优秀的编程教程", "这是一部引人入胜的历史著作",
            "这是一部深刻的哲学思考", "这是一部实用的技术指南", "这是一部启发性的科学读物"
        );
        
        List<String> covers = Arrays.asList(
            "https://example.com/cover1.jpg", "https://example.com/cover2.jpg", "https://example.com/cover3.jpg",
            "https://example.com/cover4.jpg", "https://example.com/cover5.jpg"
        );
        
        Random random = new Random();
        List<Category> categories = categoryRepository.findAll();
        
        for (int i = 0; i < 30; i++) {
            Book book = new Book();
            book.setName(bookNames.get(i % bookNames.size()));
            book.setAuthor(authors.get(i % authors.size()));
            book.setDescription(descriptions.get(i % descriptions.size()));
            book.setPublishAt(1990 + random.nextInt(34)); // 1990-2023
            book.setBookNo("BK" + String.format("%06d", i + 1));
            book.setCover(covers.get(i % covers.size()));
            book.setStock(random.nextInt(20) + 1); // 1-20
            book.setCategory(categories.get(random.nextInt(categories.size())));
            book.setCreatedAt(LocalDateTime.now().minusDays(random.nextInt(100)));
            bookRepository.save(book);
        }
    }
    
    private void createBorrows() {
        List<User> users = userRepository.findAll();
        List<Book> books = bookRepository.findAll();
        Random random = new Random();
        
        // 创建20条借阅记录
        for (int i = 0; i < 20; i++) {
            Borrow borrow = new Borrow();
            borrow.setUser(users.get(random.nextInt(users.size())));
            borrow.setBook(books.get(random.nextInt(books.size())));
            borrow.setStatus(random.nextBoolean() ? BorrowStatus.ON : BorrowStatus.OFF);
            borrow.setBorrowDate(LocalDateTime.now().minusDays(random.nextInt(30)));
            
            if (borrow.getStatus() == BorrowStatus.OFF) {
                borrow.setReturnDate(borrow.getBorrowDate().plusDays(random.nextInt(15) + 1));
            }
            
            borrowRepository.save(borrow);
        }
    }
}



