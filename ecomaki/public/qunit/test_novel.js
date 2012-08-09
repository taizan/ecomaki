$(function() {
	var novel_id = 1;
	var novel = new Novel({
		id: novel_id
	    });

	setTimeout(function() {
		test("Novel test", function() {
			ok(novel.save(), "novel.save()");
			ok(novel.chapters, "novel.chapters");
			ok(novel.chapters.novel_id, "novel.chapters.novel_id");
		    });
		
		test("Chapter test", function() {
			var chapters = novel.chapters
			//ok(novel.chapters.fetch(), "chapters.fetch()");
			ok(chapters.length > 0, "chapters.length = " + novel.chapters.length);
			ok(chapters.at(0), "chapters.at(0)");

			var chapter = chapters.at(0);
			ok(chapter.novel_id == novel.id, "chapter.novel_id = " + chapter.novel_id);
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
			ok(entry.novel_id == novel.id, "entry.novel_id = " + entry.novel_id);
			ok(entry.chapter_id == novel.chapters.at(0).id, "entry.chapter_id = " + entry.chapter_id);
			ok(entry.id, "entry.id = " + entry.id);
		    });
	    }, 2000);
    });