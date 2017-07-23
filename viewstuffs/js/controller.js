var pixnetApp = angular.module('pixnetApp', []);

pixnetApp.controller('NewArticleCtrl', function($scope, $http){
	$scope.site_categories = [];
	$scope.personal_categories = [];
	$scope.category_id;
	$scope.personal_child_categories = [];
	$scope.status = [{"id":"0","name":"刪除"},{"id":"1","name":"草稿"},{"id":2,"name":"公開"},{"id":"3","name":"密碼"},{"id":"4","name":"隱藏"},{"id":"5","name":"好友"},{"id":"7","name":"共同作者"}];
	$scope.specific_groups_of_friends = [{"id":"52010","name":"abc","order":"0"},{"id":"67871","name":"test2","order":"0"},{"id":"107103","name":"test1","order":"1"}]
	$scope.is_specific_groups_of_friends = false;
	$scope.commenting = [{"id":"0","name":"關閉留言"},{"id":"1","name":"開放所有人留言"},{"id":"2","name":"僅開放會員留言"},{"id":"3","name":"開放好友留言"}];
	// 0: 關閉留言, 1: 開放所有人留言, 2: 僅開放會員留言, 3:開放好友留言. 預設會看 Blog 整體設定
	$scope.comment_hidden = [{"id":"0","name":"公開"},{"id":"1","name":"強制隱藏"}];
	//預設留言狀態. 0: 公開, 1: 強制隱藏. 預設為0(公開)

	$scope.group_buying_categories = [{"category":"女性用品", "products":["塑身衣","香水","衛生棉","壓力襪"]},{"category":"生活綜合", "products":["刀具","天氣瓶","毛巾","片肉機","去漬凝膠","瓦斯爐","衣物柔軟精","沐浴乳","防蚊液","咖啡壺","抹布","杯具","芳香劑","便當盒","保溫杯","保溫瓶","保鮮盒","洗手乳","洗手液","洗衣精","洗碗精","洗護髮產品","玻璃罐","扇子","料理盆","真空燜燒杯","退熱貼","眼鏡","發酵布","隔熱手套","蔬果清潔劑","衛生紙","調味料","餐具","鍋具","護髮"]},{"category":"服裝飾品", "products":["包包","平底鞋","衣服","拖鞋","長靴","涼鞋","短靴","跟鞋","運動鞋","慢跑鞋","攝影背包","襪子"]},{"category":"美容彩妝", "products":["抗痘潔面組合","活水噴霧","蚊蟲止癢液","敏感護理組","噴霧精華","驅蚊器"]},{"category":"食品飲料", "products":["十六茶","大餅","水","水餃","牛軋糖","包子","可可","奶酪","巧克力","布丁","白蘆筍","地瓜酥","肉鬆","西點","佛跳牆","沙拉","乳酪球","咖啡","抹茶","果凍","果乾","果醋","果醬","泡菜","派餅","美妍社","美粒果","泰國菜","真空魚片","脆椒","啤酒","甜不辣","蛋撻","蛋糕","湯圓","菊花片","飲料","燒賣","優酪乳","醬料","雞","鵝油","爆米花","麵包","櫻桃"]},{"category":"旅遊用品", "products":["行李箱","烤肉架"]},{"category":"電器用品", "products":["三明治機","印表機","咖啡機","果汁機","空氣清淨機","按摩椅","洗衣機","烤箱","烤麵包機","液晶螢幕","電扇","蒸爐","調理組"]},{"category":"數位生活", "products":["手機","平板","相機"]},{"category":"親子育兒", "products":["小夜燈","奶粉","孕婦裝","安全座椅","尿布","防踢被","玩具","童裝","童鞋","媽媽包","親子鞋","嬰兒沐浴乳","嬰兒沙發","嬰兒餐具","黏土","攜帶毯"]},{"category":"醫療保健", "products":["益生菌","酵素","膠原蛋白錠","燕窩","雞精"]}];
	$scope.group_buying_category;
	$scope.product = [];
	
	$scope.status_id;

	// form model
	$scope.title;
	$scope.body;
	$scope.format = "json";
	$scope.status = 2;
	$scope.public_at;
	$scope.category_id = 0;
	$scope.site_category_id = 0;
	$scope.comment_perm;
	$scope.comment_hidden = 0;
	$scope.tags;	// using ',' to split
	$scope.password;
	$scope.password_hint;
	$scope.friend_group_ids;
	$scope.notify_twitter;
	$scope.notify_facebook;
	$scope.notify_plurk;

	$scope.category;
	$scope.product;
	$scope.description;
	$scope.image;

	//https://emma.pixnet.cc/friend/groups
    /*$http({method: "GET", url:"https://emma.pixnet.cc/friend/groups"}).success(function(data){
    	$scope.specific_groups_of_friends = data.friend_groups;
    });*/

	$http({method:"GET", url:"https://emma.pixnet.cc/blog/site_categories/article?format=json"}).success(function(data){
    	$scope.site_categories = data.categories;
    });

    $http({method: "GET", url:"https://emma.pixnet.cc/blog/categories?format=json&user=emmademo"}).success(function(data){
    	$scope.personal_categories = data.categories;
    });

	//http://140.112.26.241/categoriesAndProducts.php
    /*$http({method: "GET", url:"http://140.112.26.241/categoriesAndProducts.php"}).success(function(data){
    	$scope.group_buying_categories = data;
    });*/

	$scope.$watch('category_id',function(newValue, oldValue){
      	if(newValue!=oldValue){
      		var folder;
      		for(var i = 0; i < $scope.personal_categories.length; i++){
      			if($scope.personal_categories[i].id === newValue && $scope.personal_categories[i].type === 'folder'){
      				folder = $scope.personal_categories[i];
      				break;
      			}
      		}
      		if(folder != undefined && folder.child_categories != undefined)$scope.personal_child_categories = folder.child_categories;
      		else $scope.personal_child_categories = [];
      	}
    });

	$scope.$watch('group_buying_category',function(newValue, oldValue){
      	if(newValue!=oldValue){
      		$scope.product = $scope.group_buying_categories[$scope.group_buying_category].products;
      	}
    });

    $scope.submit = function(){

    }
});