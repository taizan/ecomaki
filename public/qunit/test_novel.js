$(function() {
      var novel_id = 1;
      novel = new Novel({
			    id: novel_id
			});

      setTimeout(function() {
		     test("Novel test", function() {
			      //ok(novel.save(), "novel.save()");
			      ok(novel.chapters, "novel.chapters");
			      ok(novel.chapters.novel_id, "novel.chapters.novel_id");
			      ok(novel.get("title"), "novel.title = " + novel.get("title"));
			  });
		     
		     test("Novel rewrite test", function() {
			      title = "title" + Math.random();
			      novel.set("title", title);
			      novel.save();
			      var mynovel = new Novel({
							  id: novel_id
						      });
			      stop();
			      setTimeout(function() {
					     equal(mynovel.get("title"), title);
					     start();
					 }, 2000);
			      
			  });
		     test("Chapter test", function() {
			      var chapters = novel.chapters;
			      //ok(novel.chapters.fetch(), "chapters.fetch()");
			      ok(chapters.length > 0, "chapters.length = " + novel.chapters.length);
			      ok(chapters.at(0), "chapters.at(0)");
			      
			      var chapter = chapters.at(0);
			      ok(chapter.get('novel_id') == novel.id, "chapter.novel_id = " + chapter.get('novel_id'));
			      ok(chapter.id, "chapter.id = " + chapter.id);
			      ok(chapter.save(), "chapter.save()");
			  });
		     
		     test("Entry test", function() {
			      var entries = novel.chapters.at(0).entries;
			      ok(entries.length > 0, "entries.length = " + entries.length);
			      ok(entries.chapter_id == novel.chapters.at(0).id, "entires.chapter_id = " + entries.chapter_id);
			      ok(entries.novel_id == novel.id, "entries.novel_id = " + entries.novel_id);
			      
			      var entry = entries.at(0);
			      ok(entry.url, entry.url);
			      ok(entry.get('novel_id') == novel.id, "entry.novel_id = " + entry.get('novel_id'));
			      ok(entry.get('chapter_id') == novel.chapters.at(0).id, "entry.chapter_id = " + entry.get('chapter_id'));
			      ok(entry.id != undefined, "entry.id = " + entry.id);
			  });
		     
		     test("Entry add/remove test", function() {
			      var chapter = novel.chapters.at(0);
			      
			      ok(chapter.entries.create({}));
			      ok(!chapter.entries.last().destroy());
			  });
		     
		     test("Chapter add/remove test", function() {
			      ok(novel.create_chapter());
			      ok(!novel.chapters.last().destroy());
			  });

		     test("Add/Remove balloons", function() {
			      var entry = novel.chapters.at(0).entries.at(0);
			      var old_length = entry.balloons.length;
			      var new_model = entry.balloons.create();
			      var new_length = entry.balloons.length;
			      ok(new_length == old_length + 1);
			      setTimeout(function() {new_model.destroy();}, 2000);
			      //ok(entry.balloons.length == old_length);
			  });
		 }, 2000);
  });