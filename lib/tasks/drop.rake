namespace "db" do
  task :drop do
    target = Rails.root.join('data', 'images', 'background', '*')
    `rm -f #{target}`

    target = Rails.root.join('data', 'images', 'characters', '*')
    `rm -f #{target}`

    target = Rails.root.join('data', 'images', 'entry_canvas', '*')
    `rm -f #{target}`

    target = Rails.root.join('data', 'musics', 'background', '*')
    `rm -f #{target}`
  end
end
